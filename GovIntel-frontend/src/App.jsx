import React from "react";

function App() {
    return (
        <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center gap-6 p-10">

            {/* Tailwind Test */}
            <h1 className="text-5xl font-bold text-primary">
                Tailwind + DaisyUI Test
            </h1>

            <p className="text-lg text-base-content">
                If this text is styled, Tailwind is working.
            </p>

            {/* DaisyUI Button */}
            <button className="btn btn-primary">
                DaisyUI Button
            </button>

            {/* DaisyUI Alert */}
            <div className="alert alert-success shadow-lg w-96">
                <span>DaisyUI Alert Component Working!</span>
            </div>

            {/* DaisyUI Card */}
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">DaisyUI Card</h2>
                    <p>If this card looks styled, DaisyUI is installed correctly.</p>
                    <div className="card-actions justify-end">
                        <button className="btn btn-secondary">Action</button>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default App;