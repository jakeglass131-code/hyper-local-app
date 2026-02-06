"use client";

import { QRCodeSVG } from "qrcode.react";

interface QRCodeDisplayProps {
    value: string;
    shortCode: string;
    expiresAt: number;
    type: "STAMP" | "REWARD";
}

export function QRCodeDisplay({ value, shortCode, expiresAt, type }: QRCodeDisplayProps) {
    const timeLeft = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));

    return (
        <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="mb-4 text-center">
                <h3 className="text-lg font-bold text-gray-900">
                    {type === "STAMP" ? "Earn Stamp" : "Redeem Reward"}
                </h3>
                <p className="text-sm text-gray-500">Scan to process</p>
            </div>

            <div className="p-4 bg-white rounded-lg border-2 border-gray-900">
                <QRCodeSVG value={value} size={200} />
            </div>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 mb-1">Or use code</p>
                <p className="text-3xl font-mono font-bold tracking-widest text-indigo-600">
                    {shortCode}
                </p>
            </div>

            <div className="mt-4 text-sm font-medium text-red-500">
                Expires in {timeLeft}s
            </div>
        </div>
    );
}
