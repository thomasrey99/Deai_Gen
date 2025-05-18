const Loading = () => {
    return (
        <div className="absolute inset-0 z-10 flex flex-col gap-4 items-center justify-center bg-slate-900/60 rounded-xl">
            <h2 className="font-bold">Cargando datos</h2>
            <div className="loader">
                <div className="circle">
                    <div className="dot"></div>
                    <div className="outline"></div>
                </div>
                <div className="circle">
                    <div className="dot"></div>
                    <div className="outline"></div>
                </div>
                <div className="circle">
                    <div className="dot"></div>
                    <div className="outline"></div>
                </div>
                <div className="circle">
                    <div className="dot"></div>
                    <div className="outline"></div>
                </div>
            </div>
        </div>
    );
};

export default Loading;
