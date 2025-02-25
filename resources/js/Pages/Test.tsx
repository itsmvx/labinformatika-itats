"use client"
import { saveAs } from 'file-saver';
import { Document, Image, Page, pdf, StyleSheet, Text, View } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { MahiruCirle, MahiruStandart } from "@/lib/StaticImagesLib";
import LogoJarkom from "@/assets/logo-jarkom-new.png";

export default function Test() {
    const styles = StyleSheet.create({
        page: {
            flexDirection: 'column',
            backgroundColor: '#fff',
            padding: 16,
        },
        header: {
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 10,
        },
        logo: {
            width: 35,
            height: 35,
        },
        titleContainer: {
            alignItems: 'center',
        },
        titleText: {
            fontFamily: 'Helvetica-Bold',
            fontSize: 14.5,
        },
        subtitleText: {
            fontSize: 9,
        },
        divider: {
            backgroundColor: '#000',
            width: '100%',
            height: 1,
            marginVertical: 10,
        },
        content: {
            flexDirection: 'row',
            flex: 1,
            gap: 8,
        },
        profileImage: {
            width: 90,
            aspectRatio: '3 / 4',
            objectFit: 'cover',
            objectPosition: 'center',
        },
        bioContainer: {
            gap: 5,
            fontSize: 8.5,
        },
        bioRow: {
            flexDirection: 'row',
            gap: 2,
        },
        bioLabel: {
            fontFamily: 'Helvetica-Bold',
            fontWeight: 'bold',
            width: 38,
        },
        bioLabelWide: {
            fontFamily: 'Helvetica-Bold',
            fontWeight: 'bold',
            width: 90,
        },
        tableWrapper: {
            marginTop: 12,
            border: '0.5px solid #333',
            marginBottom: 20,
        },
        tableHeader: {
            width: '100%',
            textAlign: 'center',
            fontFamily: 'Helvetica-Bold',
            fontSize: 10.5,
            fontWeight: 'extrabold',
            padding: 4,
            border: '1px solid #333'
        },
        table: {
            width: '100%',
            textAlign: 'center',
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        cell: {
            border: '0.5px solid #333',
            padding: 2.5,
            flex: 1,
            fontFamily: 'Helvetica-Bold',
            fontSize: 6,
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        emptyCell: {
            border: '0.5px solid #333',
            padding: 20,
            flexGrow: 1,
        }
    });

    const savePDF = async () => {
        try {
            const doc = (
                <Document>
                    {Array.from({ length: 70 }).map((_, index) => ((
                        <Page size="A6" orientation="landscape" style={styles.page} key={index}>
                            <View style={styles.header}>
                                <Image style={styles.logo} src={MahiruCirle} />
                                <View style={styles.titleContainer}>
                                    <Text style={styles.titleText}>Kartu Praktikum</Text>
                                    <Text style={styles.subtitleText}>Jaringan Komputer XXXIX - 2024</Text>
                                    <Text style={styles.subtitleText}>Laboratorium Jaringan Komputer</Text>
                                </View>
                                <Image style={styles.logo} src={LogoJarkom} />
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.content}>
                                <Image src={MahiruStandart} style={styles.profileImage} />
                                <View style={styles.bioContainer}>
                                    <View style={styles.bioRow}><Text style={styles.bioLabel}>Nama</Text><Text>: Elaina Annisa Zahra</Text></View>
                                    <View style={styles.bioRow}><Text style={styles.bioLabel}>NPM</Text><Text>: 06.2024.1.01234</Text></View>
                                    <View style={styles.bioRow}><Text style={styles.bioLabel}>Sesi</Text><Text>: 06.2024.1.01234</Text></View>
                                    <View style={styles.bioRow}><Text style={styles.bioLabelWide}>Asisten Pembimbing</Text><Text>: Latiful Sirri</Text></View>
                                    <View style={styles.bioRow}><Text style={styles.bioLabelWide}>Dosen Pembimbing</Text><Text>: Cak Danang</Text></View>
                                </View>
                            </View>
                            <View style={styles.tableWrapper}>
                                <Text style={styles.tableHeader}>Pelanggaran</Text>
                                <View style={styles.table}>
                                    <View style={styles.row}>
                                        {Array.from({ length: 8 }).map((_, index) => (
                                            <View key={index} style={styles.cell}><Text>Pertemuan {index + 1}</Text></View>
                                        ))}
                                    </View>
                                    <View style={styles.row}>
                                        {Array.from({ length: 8 }).map((_, index) => (
                                            <View key={index} style={styles.emptyCell} />
                                        ))}
                                    </View>
                                </View>
                            </View>
                        </Page>
                    )))}
                </Document>
            );
            const asPdf = pdf();
            asPdf.updateContainer(doc);
            const pdfBlob = await asPdf.toBlob();
            saveAs(pdfBlob, 'document.pdf');
        } catch (error) {
            console.error(error);
            alert('Error generating PDF');
        }
    };

    return <Button onClick={savePDF}>Download</Button>;
}
