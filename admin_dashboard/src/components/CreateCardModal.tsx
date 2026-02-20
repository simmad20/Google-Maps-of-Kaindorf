import React, { useState, useRef, useCallback } from 'react';
import { IoCloseSharp } from 'react-icons/io5';
import { ICard } from '../models/interfaces';
import CardService from "../services/CardService.tsx";

interface ICreateCardModal {
    isOpen:    boolean;
    onClose:   () => void;
    onCreated: (card: ICard) => void;
}

interface ImgPreview {
    file:    File;
    dataUrl: string;
    width:   number;
    height:  number;
}

const CreateCardModal: React.FC<ICreateCardModal> = ({
                                                             isOpen, onClose, onCreated
                                                         }) => {
    const [title,       setTitle]       = useState('');
    const [preview,     setPreview]     = useState<ImgPreview | null>(null);
    const [isDragging,  setIsDragging]  = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error,       setError]       = useState<string | null>(null);
    const fileInputRef                  = useRef<HTMLInputElement>(null);

    // ── Reset / close ────────────────────────────────────────────────────────

    const reset = () => {
        setTitle(''); setPreview(null);
        setIsDragging(false); setIsUploading(false); setError(null);
    };
    const handleClose = () => { reset(); onClose(); };

    // ── Image reading ────────────────────────────────────────────────────────

    const loadFile = useCallback((file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Only image files are supported (PNG, JPEG, WebP …)');
            return;
        }
        if (file.size > 20 * 1024 * 1024) {
            setError('Image must be smaller than 20 MB');
            return;
        }
        setError(null);
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            const img = new Image();
            img.onload = () =>
                setPreview({ file, dataUrl, width: img.naturalWidth, height: img.naturalHeight });
            img.src = dataUrl;
        };
        reader.readAsDataURL(file);
    }, []);

    // ── Drag & drop ──────────────────────────────────────────────────────────

    const onDragOver  = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true);  };
    const onDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
    const onDrop      = (e: React.DragEvent) => {
        e.preventDefault(); setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) loadFile(file);
    };

    const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) loadFile(file);
    };

    const handleSubmit = async () => {
        if (!title.trim()) { setError('Please enter a card name'); return; }
        if (!preview)      { setError('Please select an image');   return; }

        setIsUploading(true);
        setError(null);

        try {
            const created = await CardService.createCard(title, preview.file);
            onCreated(created);
            reset();
            onClose();
        } catch (e: any) {
            setError(e.message ?? 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    };


    if (!isOpen) return null;

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
            {/* Modal panel */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">🗺️ New Card / Floor</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <IoCloseSharp size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-5">

                    {/* Title input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Card name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                            placeholder="e.g. Ground Floor / EG"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Drop zone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Floor plan image <span className="text-red-500">*</span>
                        </label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
                            className={`
                                relative border-2 border-dashed rounded-xl cursor-pointer
                                transition-all duration-200 overflow-hidden
                                ${isDragging
                                ? 'border-blue-500 bg-blue-50 scale-[1.01]'
                                : preview
                                    ? 'border-green-400 bg-green-50'
                                    : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'}
                            `}
                            style={{ minHeight: 180 }}
                        >
                            {preview ? (
                                /* Image preview */
                                <div className="flex flex-col items-center p-3 gap-2">
                                    <img
                                        src={preview.dataUrl}
                                        alt="preview"
                                        className="max-h-40 max-w-full rounded-lg shadow object-contain"
                                    />
                                    <div className="text-xs text-gray-500 text-center">
                                        <span className="font-medium text-gray-700">{preview.file.name}</span>
                                        <br />
                                        {preview.width} × {preview.height} px
                                        &nbsp;·&nbsp;
                                        {(preview.file.size / 1024).toFixed(0)} KB
                                    </div>
                                    <button
                                        onClick={e => { e.stopPropagation(); setPreview(null); }}
                                        className="text-xs text-red-500 hover:text-red-700 underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                /* Upload prompt */
                                <div className="flex flex-col items-center justify-center h-full py-10 gap-3">
                                    <span className="text-5xl">🖼️</span>
                                    <p className="text-gray-600 font-medium">
                                        {isDragging ? 'Drop image here' : 'Drag & drop or click to select'}
                                    </p>
                                    <p className="text-xs text-gray-400">PNG, JPEG, WebP · max 20 MB</p>
                                </div>
                            )}
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={onFileInput}
                        />
                    </div>

                    {/* Dimension info */}
                    {preview && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg text-sm text-blue-700">
                            <span>📐</span>
                            <span>
                                Dimensions detected automatically:&nbsp;
                                <strong>{preview.width} × {preview.height} px</strong>
                                &nbsp;— used for accurate node placement.
                            </span>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                            <span>⚠️</span> {error}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
                    <button
                        onClick={handleClose}
                        disabled={isUploading}
                        className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-200 transition font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isUploading || !title.trim() || !preview}
                        className={`
                            px-5 py-2 rounded-lg font-semibold text-white transition flex items-center gap-2
                            ${isUploading || !title.trim() || !preview
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}
                        `}
                    >
                        {isUploading ? (
                            <>
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10"
                                            stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8v8H4z"/>
                                </svg>
                                Uploading…
                            </>
                        ) : (
                            '✅ Create Card'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateCardModal;