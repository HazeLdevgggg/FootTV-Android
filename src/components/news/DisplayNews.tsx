import React, { useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';

import WebView from 'react-native-webview';
import { MyText, MyTextBold } from '../tags/MyText';
import Settings from '../../constants/Settings';
import Paragraphe from './Paragraphe';
import MyImage from '../tags/MyImage';
import LinearGradient from 'react-native-linear-gradient';
import { Banner } from '../../hooks/Pub';
import { ThemeContext } from "../../context/ThemeContext";
import { useContext } from 'react';
import { AppConfig } from '../../AppConfig';
import { ArticleDetail } from '../../utils/ArticleDetailType';

export default function InfoItem(props: ArticleDetail) {
    const { darkMode } = useContext(ThemeContext);
    const { width: contentWidth } = useWindowDimensions();
    var html = props.info;
    console.log(html);
    html = html.replace(/(<img\b[^>]*)(width|height)="[^"]*"([^>]*>)/g, '$1$3');

    const [webViewHeight, setWebViewHeight] = useState(contentWidth * 0.5625); // Hauteur par défaut (16:9)
    const webViewRef = useRef(null);

    const injectedJavaScript = `
       (function() {
        const meta = document.createElement('meta');
        meta.setAttribute('name', 'viewport');
        meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        document.getElementsByTagName('head')[0].appendChild(meta);

        function updateHeight() {
            const height = document.documentElement.scrollHeight; // Utilise documentElement pour plus de fiabilité
            window.ReactNativeWebView.postMessage(height);
        }

        // Appelle updateHeight après le chargement initial et de manière répétée
        window.addEventListener('load', updateHeight);
        setInterval(updateHeight, 1000); // Récupère la hauteur chaque seconde pendant quelques instants pour garantir la précision
        })();
        true;
    `;

    const onMessage = (event: { nativeEvent: { data: any; }; }) => {
        const newHeight = Number(event.nativeEvent.data);
        if (newHeight) {
            setWebViewHeight(newHeight);
        }
    };

    return (
        <>
            <View style={styles.imageContainer}>
                <MyImage
                    source={props.photo} // Remplace avec l'URL réelle de l'image
                    style={styles.image}
                    contentFit='cover'
                />
                <View style={styles.captionOverlay}></View>
                <View style={styles.overlayContainerUne}>
                </View>
            </View>
            <View style={styles.contenu}>
                {props.contenu.liste.map((item:any) => (
                    <Paragraphe key={item.pos} item={item} />
                ))}
                
                {props.nbr_iframe > 0 && (
                    <View style={styles.twitterContainer}>
                    {props.iframe.map((url: any, index: any) => (
                        <WebView
                            key={index}
                            source={{ uri: url }}
                            style={{ width: contentWidth - 32, height: (contentWidth - 32) * 9 / 16, marginVertical: 10 }}
                            allowsFullscreenVideo
                            javaScriptEnabled
                            domStorageEnabled
                        />
                    ))}
                    </View>
                )}
                {props.nbr_tweet > 0 && (
                    <View style={styles.twitterContainer}>
                        <WebView
                            key='100'
                            source={{ uri: props.iframe_twitter }}
                            style={{
                                width: contentWidth, // Largeur totale de l'écran
                                height: webViewHeight, // Hauteur dynamique en fonction du contenu
                            }}
                            allowsFullscreenVideo
                            javaScriptEnabled
                            domStorageEnabled
                            injectedJavaScript={injectedJavaScript}
                            onMessage={onMessage}
                            scalesPageToFit={true}
                        />                   
                    </View>
                )}
            </View>
            <View>
                {props.pub_article_bottom!=='' &&(
                    <Banner unitId={props.pub_article_bottom} darkMode={darkMode}/>
                )}    
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 1, // Ajoute une marge en bas pour éviter que le bas de l'article soit coupé
    },
    contenu: {
        padding: 15,
        marginBottom: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    category: {
        fontSize: 14,
        color: '#4096ee',
        textTransform: 'uppercase'
    },
    imageContainer: {
        width: '100%',
        height: 400,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    captionOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.1)', // Fond noir semi-transparent
        height: 55
    },
    content: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 8,
    },
    videoContainer: {
        marginTop: 20,
    },
    twitterContainer: {
        flex: 1,
        alignItems: 'center',
        width: '100%'
    },
    rowtitre: {
        marginLeft: 15,
        marginTop: 10
    },
    titre: {
        fontSize: 20,
        marginBottom: 10
    },
    overlayContainerUne: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 120, // 🔹 Ajuste si besoin selon ton image
        justifyContent: 'flex-end',
    },
    overlayContentUne: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
});