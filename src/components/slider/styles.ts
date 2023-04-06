const sliderStyle: (isShow: boolean) => {
    position: string;
    width: string;
    height: number;
    opacity: number;
    transition: string;
} = (isShow: boolean) => {
    return {
        position: "relative",
        width: "100%",
        height: 80,
        opacity: isShow ? 1 : 0,
        transition: "opacity 200ms linear",
    };
};

const railStyle = {
    position: "absolute",
    width: "100%",
    height: 7,
    marginTop: 35,
    borderRadius: 5,
    backgroundImage: "linear-gradient(white, black)",
};

export { sliderStyle, railStyle };
