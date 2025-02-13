import { AlertTriangle } from 'lucide-react'
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

export default function BanListPage({ banList }: {
    banList: {
        alasan: string;
        kadaluarsa: string;
    };
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white">
            <div className="relative w-full max-w-2xl px-4 py-8 mx-auto text-center">
                {/* Background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-96 h-96 bg-yellow-500 rounded-full opacity-10 blur-3xl"></div>
                    </div>
                    <div className="absolute right-0 bottom-0 translate-x-1/3 translate-y-1/3">
                        <div className="w-72 h-72 bg-red-500 rounded-full opacity-10 blur-3xl"></div>
                    </div>
                </div>

                {/* Content */}
                <div className="relative">
                    <AlertTriangle className="w-24 h-24 mx-auto mb-8 text-yellow-500" />
                    <h1 className="text-4xl font-bold mb-4">Walawee</h1>
                    <p className="text-xl mb-8">
                        Kami mendeteksi anda melakukan pelanggaran
                    </p>
                    <div className="space-y-4">
                        <p className="text-gray-300">
                            Alasan : { banList.alasan }
                        </p>
                        <p className="text-gray-300">
                            Release Ban : { format(banList.kadaluarsa, 'PPPpp', { locale: localeId }) }
                        </p>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 left-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                </div>
                <div className="absolute bottom-4 right-4">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                </div>
            </div>
        </div>
    )
}

