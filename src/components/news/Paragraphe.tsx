import { StyleSheet, useWindowDimensions, View } from 'react-native'
import React from 'react'
import RenderHTML, { MixedStyleDeclaration } from 'react-native-render-html'
import { useTypedNavigation } from '../../navigation/navigation';
import { Banner } from '../../hooks/Pub';
import { MyText, MyTextBold } from '../tags/MyText';
import { ThemeContext } from "../../context/ThemeContext";
import { useContext } from 'react';
import { AppConfig } from '../../AppConfig';

function createOnPress() {
    const navigation = useTypedNavigation();
    return (event: any, href: string) => {
      href = href.replace(/\//g, '');
      href = href.replace('about:', '');
      var id = Number(href);
      var site = "0";
      navigation.push("Article", {id : id.toString()})
    };
}

const Paragraphe = ({item} : {item:any}) => {
    const { darkMode } = useContext(ThemeContext);
    const { width: contentWidth } = useWindowDimensions();
    var html = item.contenu;

    const customStyles: Record<string, MixedStyleDeclaration> = {
        h2: { color: AppConfig.MainTextColor(darkMode), fontSize: 18, fontWeight: 900,marginVertical: 10 },
        p: { marginVertical: 8, maxWidth: '100%' },
        div: { marginVertical: 8, maxWidth: '100%' },
        i: { fontStyle: 'italic' },
        a: { textDecorationLine: 'underline', color:"#3f96ee" },
        img: {
            marginVertical: 12,
            borderRadius: 8, // Ajoute un arrondi aux coins de l'image
            width: '98%',
            height: undefined
        },
        hr: {
            marginTop:30
        },
        table: {
            maxWidth: '100%',
        },
        tr: { maxWidth: '100%' },
        td: { maxWidth: '100%', overflow: 'hidden' }
    };

    const renderersProps = {
        a: {
            onPress: createOnPress()
        },
        img: {
            enableExperimentalPercentWidth: true, // Permet aux images de s'adapter à la largeur
        }
    };

    return (
        <>
            {item.html === 1 && (
                <RenderHTML 
                    contentWidth={contentWidth} 
                    source={{ html }} 
                    tagsStyles={customStyles} 
                    renderersProps={renderersProps}
                    baseStyle={{
                        fontSize: 16, 
                        color: AppConfig.MainTextColor(darkMode),
                        lineHeight:28,
                    }}
                />
            )}
            {item.pub.display === 1 && (
                <Banner unitId={item.pub.banner.id} pagetype="article" darkMode={darkMode}/>
            )}
        </>
    )
}

export default Paragraphe