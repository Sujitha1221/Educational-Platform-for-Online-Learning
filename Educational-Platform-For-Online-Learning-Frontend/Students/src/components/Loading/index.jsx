import React from 'react';

const Loading = () => {
    return (
        <div className='fixed top-0 h-screen w-full bg-black bg-opacity-70 flex justify-center items-center'>
            <div className='h-24 w-24 border-8 border-gray-400s border-t-blue-500 rounded-full animate-spin'>

            </div>
        </div>
    );
}

export default Loading;
