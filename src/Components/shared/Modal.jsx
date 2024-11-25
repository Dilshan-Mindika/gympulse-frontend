function Modal({isOpen,onClose, title, children }) {
    if (!isOpen) return null;

    return(
        <div className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
             <div className="bg-white rounded-xl p-6 max-w-md w-full transform transition-all duration-300 scale-100">
               <div className="flex justify-between items-center mb-4">
                <h3 className=" text-x1 font-semibold text-gray-800">{title}</h3>
                <button 
                 onClick={onClick}
                 className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                 ></button>
             </div>
             {children}
             </div>
        </div>
    )
}

export default Modal;