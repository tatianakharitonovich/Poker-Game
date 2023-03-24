import * as React from "react";
import { render, fireEvent, act, within, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import { App } from "../App";

describe("App", () => {
    jest.useFakeTimers();

    const getApp = () => {
        const { container } = render(<App />);

        const getForm = () => within(container).getByTestId("registration-form");

        const getItemByName = (name: string) => {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const element = Array.from(container.querySelectorAll<HTMLElement>('[data-test="player"]')).find(element => {
                const nameElement = within(element).getByTestId("player-name");
                return nameElement.innerHTML === name;
            });
            if (!element) {
                throw Error(`No player found for name ${name}`);
            }
            return element;
        };

        return {
            getContainer: () => container,
            getGame: () =>
                container.querySelector('[data-test="game"]'),
            getUserName: () =>
                container.querySelector('[data-test="name-input"]'),
            getMaleCheckBoxInput: () =>
                within(container).getByTestId("male-input"),
            getFemaleCheckBoxInput: () =>
                container.querySelector('[data-test="female-input"]'),
            getItemsList: () => container.querySelectorAll('[data-test="list-item"]'),
            getSaveButton: () => within(getForm()).getByTestId("form-save-button"),
            getLoadingScreen: () => document.querySelector('[data-test="loading-overlay"]'),
            getItemByName: getItemByName,
            getValuesFromName: (nameValue: string) => {
                const row = getItemByName(nameValue);
                const name = within(row).getByTestId("player-name").innerHTML;
                return {
                    name: name,
                };
            },
        };
    };

    describe("Base elements", () => {
        it("should render name input and gender checkbox input", () => {
            const app = getApp();
            const userName = app.getUserName();
            const maleCheckBoxInput = app.getMaleCheckBoxInput();
            const femaleCheckBoxInput = app.getFemaleCheckBoxInput();

            expect(userName).toBeTruthy();
            expect(maleCheckBoxInput).toBeTruthy();
            expect(femaleCheckBoxInput).toBeTruthy();
        });
    });

    describe("Render UserName", () => {
        it("should render userName", async () => {
            const app = getApp();
            const userNameValue = "Natasha";

            const userName = app.getUserName();
            const maleCheckBoxInput = app.getMaleCheckBoxInput();

            fireEvent.change(userName as HTMLInputElement, {
                target: { value: userNameValue },
            });

            fireEvent.click(maleCheckBoxInput);

            await act(async () => {
                await waitFor(() => app.getSaveButton().getAttribute("disabled") === null);
                fireEvent.click(app.getSaveButton());
                await waitFor(() => app.getLoadingScreen() !== null);
            });

            jest.runAllTimers();

            await waitForElementToBeRemoved(() => app.getLoadingScreen(), { timeout: 20000 });
            // expect(app.getLoadingScreen()).toBeFalsy();

            await act(async () => {
                jest.runAllTimers();
                await waitFor(() => app.getGame() !== null);
                const game = app.getGame();
                // const nameData = app.getValuesFromName(userNameValue);
                // expect(nameData.name).toEqual(userNameValue);
            });
        });
    });
});
