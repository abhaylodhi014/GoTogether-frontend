import React from 'react';

function Alert(props) {
    const capitalize = (word) => {
        if (!word) return '';  // Return empty string if word is undefined or null

       
        if (word === "danger") {
            word = "error";
        }
        const lower = word.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    };

    const alertColors = {
        success: "bg-green-100 border-green-100 text-green-700",
        error: "bg-red-100 border-red-100 text-red-700",
        warning: "bg-yellow-100 border-yellow-100 text-yellow-700",
        info: "bg-blue-100 border-blue-100 text-blue-700"
    };

    return (
        <div  className='bg-gray-200 absolute z-200 w-full'> 
            {props.alert && (
                <div className={`border-l-4 p-4 rounded-md shadow-md flex justify-between items-center ${alertColors[props.alert.types] || 'bg-gray-100 border-gray-400 text-gray-700'}`} role="alert">
                    <span>
                        <strong>{capitalize(props.alert.types)}!</strong> {props.alert.msg}
                    </span>
                    <button 
                        onClick={props.onClose}
                        className="text-xl font-bold focus:outline-none"
                    >
                        &times;
                    </button>
                </div>
            )}
        </div>
    );
}

export default Alert;


//CLS = comulative layout shift ; 
//kuch external factor(like alert) ke ane per layout ka shift hona