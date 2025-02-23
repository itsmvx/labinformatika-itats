"use client"
import { saveAs } from 'file-saver';
import { useState, useEffect } from "react"
import { Document, Image, Page, pdf, StyleSheet, Text, View } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { MahiruCirle, MahiruStandart } from "@/lib/StaticImagesLib";
import LogoJarkom from "@/assets/logo-jarkom-new.png";

export default function Test() {
    const [isOpen, setIsOpen] = useState(false)
    const [dontShowAgain, setDontShowAgain] = useState(false)

    useEffect(() => {
        const hasVisited = localStorage.getItem("hasVisited")
        if (!hasVisited) {
            setIsOpen(true)
            localStorage.setItem("hasVisited", "true")
        }
    }, [])

    const handleClose = () => {
        setIsOpen(false)
        if (dontShowAgain) {
            localStorage.setItem("neverShowWelcome", "true")
        }
    }

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
            gap: '10px'
        },
        logo: {
            width: 35,
            height: 35,
        },
        headerContents: {
            flexBasis: 'auto',
            justifyContent: 'center',
        },
        bio: {
            gap: 5,
            fontSize: '8.5px'
        },
        bioRow: {
            flexDirection: 'row',
            gap: 2
        },
        bioTitle: {
            fontFamily: 'Helvetica-Bold',
            fontWeight: 'bold',
            width: 40
        },
        bioAssistant: {
            fontFamily: 'Helvetica-Bold',
            fontWeight: 'bold',
            width: 90
        },
        tableWrapper: {
            marginTop: 12,
            border: '0.5px solid #333333', // Border untuk seluruh table wrapper
            marginBottom: 20, // Memberikan jarak bawah
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse', // Menggabungkan border agar tidak ada celah antar cell
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        cell: {
            border: '0.5px solid #333333',
            padding: 6,
            flexGrow: 1,
            textAlign: 'center',
            fontFamily: 'Helvetica-Bold',
            fontSize: '10px',
            fontWeight: 'bold',
            alignContent: 'center'
        },

    });
    const savePDF = async () => {
        try {
            const doc = (
                <Document>
                    <Page size="A6" orientation="landscape" style={styles.page}>
                        <View style={styles.header}>
                            <Image style={styles.logo} src={MahiruCirle} />
                            <View style={{
                                alignItems: 'center',
                            }}>
                                <Text style={{ fontFamily: 'Helvetica-Bold', fontWeight: 'heavy', fontSize: '14.5px' }}>Kartu Praktikum</Text>
                                <Text style={{ fontWeight: 'normal', fontSize: '9px' }}>Jaringan Komputer XXXIX - 2024</Text>
                                <Text style={{ fontWeight: 'normal', fontSize: '9px' }}>Laboratorium Jaringan Komputer</Text>
                            </View>
                            <Image style={styles.logo} src={LogoJarkom} />
                        </View>
                        <View style={{ backgroundColor: '#000', width: '100%', height: '1px', marginVertical: '10px' }} />
                        <View style={{
                            flexDirection: 'row',
                            flexBasis: 'auto',
                            flex: '1 1 0%',
                            gap: '0.5rem',
                        }}>
                            <View style={{   }}>
                                <Image src={MahiruStandart} style={{
                                    width: '90px',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                    aspectRatio: '3 / 4'
                                }} />
                            </View>
                            <View style={styles.bio}>
                                <View style={styles.bioRow}>
                                    <Text style={styles.bioTitle}>
                                        Nama
                                    </Text>
                                    <Text>
                                        : Elaina Annisa Zahra
                                    </Text>
                                </View>
                                <View style={styles.bioRow}>
                                    <Text style={styles.bioTitle}>
                                        NPM
                                    </Text>
                                    <Text>
                                        : 06.2024.1.01234
                                    </Text>
                                </View>
                                <View style={styles.bioRow}>
                                    <Text style={styles.bioTitle}>
                                        Sesi
                                    </Text>
                                    <Text>
                                        : 06.2024.1.01234
                                    </Text>
                                </View>
                                <View style={styles.bioRow}>
                                    <Text style={styles.bioAssistant}>
                                        Asisten Pembimbing
                                    </Text>
                                    <Text>
                                        : Latiful Sirri
                                    </Text>
                                </View>
                                <View style={styles.bioRow}>
                                    <Text style={styles.bioAssistant}>
                                        Dosen Pembimbing
                                    </Text>
                                    <Text>
                                        : Cak Danang
                                    </Text>
                                </View>
                            </View>
                            {/*FILL*/}
                        </View>
                        <View style={styles.tableWrapper}>
                            <View style={{
                                width: '100%',
                                border: '1px solid #333333',
                                marginBottom: -1,
                            }}>
                                <Text style={{ textAlign: 'center', fontFamily: 'Helvetica-Bold', fontSize: "10.5px", fontWeight: 'extrabold', padding: 2 }}>Pelanggaran</Text>
                            </View>
                            <View style={styles.table}>
                                <View style={styles.row}>
                                    { Array.from({ length: 8 }).map((_, index) => ((
                                        <Text style={styles.cell}>P{index+1}</Text>
                                    )))}
                                </View>
                                <View style={styles.row}>
                                    <View style={{
                                        border: '0.5px solid #333333',
                                        padding: 20,
                                        flexGrow: 1,
                                    }}>{" "}</View> <View style={{
                                        border: '0.5px solid #333333',
                                        padding: 20,
                                        flexGrow: 1,
                                    }}>{" "}</View> <View style={{
                                        border: '0.5px solid #333333',
                                        padding: 20,
                                        flexGrow: 1,
                                    }}>{" "}</View> <View style={{
                                        border: '0.5px solid #333333',
                                        padding: 20,
                                        flexGrow: 1,
                                    }}>{" "}</View><View style={{
                                        border: '0.5px solid #333333',
                                        padding: 20,
                                        flexGrow: 1,
                                    }}>{" "}</View><View style={{
                                        border: '0.5px solid #333333',
                                        padding: 20,
                                        flexGrow: 1,
                                    }}>{" "}</View><View style={{
                                        border: '0.5px solid #333333',
                                        padding: 20,
                                        flexGrow: 1,
                                    }}>{" "}</View><View style={{
                                        border: '0.5px solid #333333',
                                        padding: 20,
                                        flexGrow: 1,
                                    }}>{" "}</View>
                                </View>
                            </View>
                        </View>
                    </Page>
                </Document>

            );

            const asPdf = pdf();
            asPdf.updateContainer(doc);
            const pdfBlob = await  asPdf.toBlob();
            saveAs(pdfBlob, 'document.pdf');
        } catch (error) {
            console.error(error);
            alert('Error generating PDF');
        }
    }

    return (
        <>
            <Button onClick={savePDF}>
                Download
            </Button>
        </>
    )
}

