import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 20,
    },
    leftColumn: {
        width: '30%',
        paddingRight: 20,
    },
    rightColumn: {
        width: '70%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 5,
    },
    text: {
        fontSize: 12,
        marginBottom: 4,
    },
    table: {
        display: 'flex',
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000',
        marginTop: 10,
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000',
        padding: 5,
        flexGrow: 1,
        textAlign: 'center',
    },
    image: {
        width: 100,
        height: 133,
        borderRadius: 5,
        border: '1px solid #000',
    },
});
const KartuPraktikum = () => {
    return (
        <Document>
            <Page size="A6" orientation="landscape" style={styles.page}>
                <View>
                    <Text style={styles.title}>Kartu Praktikum</Text>
                    <Text style={styles.subtitle}>Pemrograman Terstruktur - 2024</Text>
                    <Text style={styles.subtitle}>Laboratorium Bahasa Pemrograman</Text>
                </View>
                <View style={styles.leftColumn}>
                    <Image
                        style={styles.image}
                        src="https://images.unsplash.com/photo-1597589827317-4c6d6e0a90bd?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    />
                </View>
                <View style={styles.rightColumn}>
                    <Text style={styles.text}>Nama: Rakha Ananta Baskoro</Text>
                    <Text style={styles.text}>NPM: 06.2024.1.07842</Text>
                    <Text style={styles.text}>Sesi: Jum'at, 10.00 - 11.30</Text>
                    <Text style={styles.text}>Asisten Pembimbing: Ahmad Maulana Ismaindra</Text>
                    <Text style={styles.text}>Dosen Pembimbing: Citra Nurina Prabiantissa, S.ST., M.Tr.Kom.</Text>

                    <View style={styles.table}>
                        <View style={styles.row}>
                            <Text style={styles.cell}>Modul 1</Text>
                            <Text style={styles.cell}>Modul 2</Text>
                            <Text style={styles.cell}>Modul 3</Text>
                            <Text style={styles.cell}>Modul 4</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.cell}>-</Text>
                            <Text style={styles.cell}>-</Text>
                            <Text style={styles.cell}>-</Text>
                            <Text style={styles.cell}>-</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default KartuPraktikum;

