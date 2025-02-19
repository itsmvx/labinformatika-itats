import type { Delta } from "quill";

export const _MyWebConfig = {
    VIEW_PER_PAGE: [ 15, 30, 50, 100 ],
};
export const deltaInit = { ops: [{ insert: "\n" }] } as Delta;
export const _NamaHari = [
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
    "Minggu",
];

export const Aslab_DATA: {
    id: string;
    nama: string;
    npm: string;
    username: string;
    jabatan: string | null;
}[] = [
    {
        id: "b1c92c50-09c3-4c2b-b77e-5c88d8dbd598",
        nama: "Mochamad Luthfan Rianda Putra",
        npm: "06.2021.1.07397",
        username: "pann",
        jabatan: 'Koordinator'
    },
    {
        id: "435db5f2-03f1-4c72-b032-4ef4585d5051",
        nama: "Indy Adira Khalfani",
        npm: "06.2021.1.07434",
        username: "viole",
        jabatan: 'Sekretaris'
    },
    {
        id: "d321fc94-4769-43bb-9ec6-d07c6146b6db",
        nama: "Latiful Sirri",
        npm: "06.2021.1.07461",
        username: "vain",
        jabatan: 'Hardware-Software'
    },
    {
        id: "ce0631b3-52d6-486e-aebb-df2b02ff65e4",
        nama: "Chatarina natassya putri",
        npm: "06.2021.1.07482",
        username: "nat",
        jabatan: 'Bendahara'
    },
    {
        id: "7816e3c1-5b08-42b1-9c18-c1b2dc097dbf",
        nama: "Afzal Musyaffa Lathif Ashrafil Adam",
        npm: "06.2022.1.07587",
        username: "afgood",
        jabatan: 'Koordinator'
    },
    {
        id: "f02e5b1a-5fa8-4f69-8331-fd674379e650",
        nama: "Windi Nitasya Lubis",
        npm: "06.2022.1.07590",
        username: "windi",
        jabatan: 'Sekretaris'
    },
    {
        id: "d6492a8e-0b94-46e6-9b38-8caa6e5db879",
        nama: "Marikh kasiful izzat",
        npm: "06.2022.1.07610",
        username: "tazz",
        jabatan: 'Hardware-Software'
    },
    {
        id: "7c03724f-c68c-4f65-bfb7-ec6f9cfb0988",
        nama: "Gregoria Stefania Kue Siga",
        npm: "06.2022.1.07626",
        username: "greiss",
        jabatan: 'Bendahara'
    }
];

