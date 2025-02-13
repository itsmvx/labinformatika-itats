import { FuminocchiPP, NoaPP, ShorekeeperPP } from "@/lib/StaticImagesLib";

const anomalies = [
    { name: 'Fuminocchi', avatar: FuminocchiPP, role: 'Joy' },
    { name: 'Ushio Noa', avatar: NoaPP, role: 'Zero' },
    { name: 'The Shorekeeper', avatar: ShorekeeperPP, role: 'Vain' },
];

export default function HallOfFamesPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 shadow-2xl max-w-4xl w-full">
                <h1 className="text-4xl font-bold text-center mb-8 text-white">
                    mY <s>kisah</s> Heartfelt Thanks
                </h1>
                <p className="text-xl text-center mb-12 text-blue-50">
                    Makasih untuk tiga Anomali Biru kesayangan gwe️💙
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mb-12">
                    { anomalies.map((person) => (
                        <div key={ person.name } className="flex flex-col items-center">
                            <div
                                className="w-24 sm:w-28 md:w-36 lg:w-40 h-24 sm:h-28 md:h-36 lg:h-40 rounded-full overflow-hidden border-4 border-blue-300 shadow-lg mb-4">
                                <img
                                    src={ person.avatar }
                                    alt={ person.name }
                                    className="object-cover object-center"
                                />
                            </div>
                            <p className="text-center text-white font-medium">{ person.name }</p>
                            <p className="text-sm text-center text-white font-medium">-{ person.role }</p>
                        </div>
                    )) }
                </div>
                <p className="text-center text-blue-100 italic">
                    " Vanitas Vanitatum et omnia Vanitas "
                </p>
            </div>
        </div>
    )
}

