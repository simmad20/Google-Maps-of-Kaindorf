import {IoAlertCircle} from 'react-icons/io5';

interface IConfirmDialog {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog = ({
                           isOpen,
                           title,
                           message,
                           confirmText = 'Confirm',
                           cancelText = 'Cancel',
                           onConfirm,
                           onCancel,
                           variant = 'danger'
                       }: IConfirmDialog) => {
    if (!isOpen) return null;

    const variants = {
        danger: {
            icon: 'bg-red-100 text-red-600',
            button: 'bg-red-500 hover:bg-red-600'
        },
        warning: {
            icon: 'bg-yellow-100 text-yellow-600',
            button: 'bg-yellow-500 hover:bg-yellow-600'
        },
        info: {
            icon: 'bg-blue-100 text-blue-600',
            button: 'bg-blue-500 hover:bg-blue-600'
        }
    };

    const style = variants[variant];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div
                            className={`flex-shrink-0 w-12 h-12 rounded-full ${style.icon} flex items-center justify-center`}>
                            <IoAlertCircle size={24}/>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {title}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {message}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end mt-6">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`px-4 py-2 text-white rounded-lg transition font-medium ${style.button}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;