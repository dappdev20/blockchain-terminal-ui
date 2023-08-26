import { createGlobalStyle } from 'styled-components/macro';
import 'react-tippy/dist/tippy.css';

export default () => createGlobalStyle`
    html, body {
        height: 100% !important;
        -webkit-font-smoothing: auto !important;
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;

        &.landscape {
            display: flex;
            align-items: center;
            justify-content: center;

            #root {
                transform: rotate(-90deg);
                height: 100vw !important;
                width: 100vh !important;
            }
        }
    }

    * {
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
        outline: none;
    }
    
    input {
        -webkit-touch-callout: auto; /* iOS Safari */
        -webkit-user-select: auto; /* Safari */
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;

        &::-ms-clear {
            display: none; 
        }
    }

    input:-webkit-autofill,
    input:-webkit-autofill:hover, 
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active,
    textarea:-webkit-autofill,
    textarea:-webkit-autofill:hover,
    textarea:-webkit-autofill:focus,
    select:-webkit-autofill,
    select:-webkit-autofill:hover,
    select:-webkit-autofill:focus {
        -webkit-text-fill-color: white;
        -webkit-box-shadow: 0 0 0 1000px black inset !important;
        background-clip: content-box !important;
    }
    
    #root {
        height: 100% !important;

        .fullscreen {
            height: 100%;        
        }
    }

    @font-face {
        font-family: 'AvantGarde LT CondBook';
        src: url('fonts/AvantGardeLT/itc-avant-garde-gothic-lt-condensed-book.ttf') format('truetype');
        font-weight: 500;
        font-style: normal;
    }

    @font-face {
        font-family: 'AvantGarde LT CondBook';
        src: url('fonts/AvantGardeLT/itc-avant-garde-gothic-lt-condensed-demi.ttf') format('truetype');
        font-weight: 800;
        font-style: normal;
    }
    
    @font-face {
        font-family: 'open_sans';
        src: url('/fonts/Opensans/opensans-light-webfont.woff') format('woff');
        font-weight: 300;
        font-style: normal;
    }
    @font-face {
        font-family: 'open_sans';
        src: url('/fonts/Opensans/opensans-regular-webfont.woff') format('woff');
        font-weight: 400;
        font-style: normal;
    }
    @font-face {
        font-family: 'open_sans';
        src: url('/fonts/Opensans/opensans-semibold-webfont.woff') format('woff');
        font-weight: 600;
        font-style: normal;
    }
    @font-face {
        font-family: 'open_sans';
        src: url('/fonts/Opensans/opensans-bold-webfont.woff') format('woff');
        font-weight: 700;
        font-style: normal;
    }
    @font-face {
        font-family: 'open_sans';
        src: url('/fonts/Opensans/opensans-extrabold-webfont.woff') format('woff');
        font-weight: 800;
        font-style: normal;
    }
    @font-face {
        font-family: 'open_sans_condensed';
        src: url('/fonts/Opensans/opensanscondensed-light-webfont.woff') format('woff');
        font-weight: 300;
        font-style: normal;
    }
    @font-face {
        font-family: 'open_sans_condensed';
        src: url('/fonts/Opensans/opensanscondensed-bold-webfont.woff') format('woff');
        font-weight: 800;
        font-style: normal;
    }

    @font-face {
        font-family: CoreSansC_Regular;
        src: url('/fonts/CoreSansC/CoreSansC-45Regular.otf') format('woff');
        font-weight: 500;
        font-style: normal;
    }
    @font-face {
        font-family: CoreSansC_Light;
        src: url('/fonts/CoreSansC/CoreSansC-35Light.otf') format('woff');
        font-weight: 500;
        font-style: normal;
    }
    @font-face {
        font-family: CoreSansC_ExtraLight;
        src: url('/fonts/CoreSansC/CoreSansC-25ExtraLight.otf') format('woff');
        font-weight: 500;
        font-style: normal;
    }

    @font-face {
        font-family: 'Exo 2';
        font-style: italic;
        font-weight: 100;
        src: local('Exo 2 Thin Italic'), local('Exo2-ThinItalic'), url('/fonts/Exo_2/Exo2-ThinItalic.ttf') format('truetype');
    }
    @font-face {
        font-family: 'Exo 2';
        font-style: italic;
        font-weight: 200;
        src: local('Exo 2 Extra Light Italic'), local('Exo2-ExtraLightItalic'), url('/fonts/Exo_2/Exo2-ExtraLightItalic.ttf') format('truetype');
    }
    @font-face {
        font-family: 'Exo 2';
        font-style: italic;
        font-weight: 300;
        src: local('Exo 2 Light Italic'), local('Exo2-LightItalic'), url('/fonts/Exo_2/Exo2-LightItalic.ttf') format('truetype');
    }
    @font-face {
        font-family: 'Exo 2';
        font-style: italic;
        font-weight: 400;
        src: local('Exo 2 Italic'), local('Exo2-Italic'), url('/fonts/Exo_2/Exo2-Italic.ttf') format('truetype');
    }
    @font-face {
        font-family: 'Exo 2';
        font-style: italic;
        font-weight: 500;
        src: local('Exo 2 Medium Italic'), local('Exo2-MediumItalic'), url('/fonts/Exo_2/Exo2-MediumItalic.ttf') format('truetype');
    }
    @font-face {
        font-family: 'Exo 2';
        font-style: italic;
        font-weight: 600;
        src: local('Exo 2 Semi Bold Italic'), local('Exo2-SemiBoldItalic'), url('/fonts/Exo_2/Exo2-SemiBoldItalic.ttf') format('truetype');
    }
    @font-face {
        font-family: 'Exo 2';
        font-style: italic;
        font-weight: 700;
        src: local('Exo 2 Bold Italic'), local('Exo2-BoldItalic'), url('/fonts/Exo_2/Exo2-BoldItalic.ttf') format('truetype');
    }
    @font-face {
        font-family: 'Exo 2';
        font-style: italic;
        font-weight: 800;
        src: local('Exo 2 Extra Bold Italic'), local('Exo2-ExtraBoldItalic'), url('/fonts/Exo_2/Exo2-ExtraBoldItalic.ttf') format('truetype');
    }
    @font-face {
        font-family: 'Exo 2';
        font-style: italic;
        font-weight: 900;
        src: local('Exo 2 Black Italic'), local('Exo2-BlackItalic'), url('/fonts/Exo_2/Exo2-BlackItalic.ttf') format('truetype');
    }
    @font-face {
        font-family: 'Exo 2';
        font-style: normal;
        font-weight: 100;
        src: local('Exo 2 Thin'), local('Exo2-Thin'), url('/fonts/Exo_2/Exo2-Thin.ttf') format('truetype');
    }
    @font-face {
        font-family: 'Exo 2';
        font-style: normal;
        font-weight: 200;
        src: local('Exo 2 Extra Light'), local('Exo2-ExtraLight'), url('/fonts/Exo_2/Exo2-ExtraLight.ttf') format('truetype');
    }
    @font-face {
        font-family: 'Exo 2';
        font-style: normal;
        font-weight: 300;
        src: local('Exo 2 Light'), local('Exo2-Light'), url('/fonts/Exo_2/Exo2-Light.ttf') format('truetype');
    }
    @font-face {
        font-family: 'Exo 2';
        font-style: normal;
        font-weight: 400;
        src: local('Exo 2'), local('Exo2-Regular'), url('/fonts/Exo_2/Exo2-Regular.ttf') format('truetype');
    }
    @font-face {
        font-family: 'Exo 2';
        font-style: normal;
        font-weight: 500;
        src: local('Exo 2 Medium'), local('Exo2-Medium'), url('/fonts/Exo_2/Exo2-Medium.ttf') format('truetype');
    }
    @font-face {
        font-family: 'Exo 2';
        font-style: normal;
        font-weight: 600;
        src: local('Exo 2 Semi Bold'), local('Exo2-SemiBold'), url('/fonts/Exo_2/Exo2-SemiBold.ttf') format('truetype');
    }
    @font-face {
        font-family: 'Exo 2';
        font-style: normal;
        font-weight: 700;
        src: local('Exo 2 Bold'), local('Exo2-Bold'), url('/fonts/Exo_2/Exo2-Bold.ttf') format('truetype');
    }
    @font-face {
        font-family: 'Exo 2';
        font-style: normal;
        font-weight: 800;
        src: local('Exo 2 Extra Bold'), local('Exo2-ExtraBold'), url('/fonts/Exo_2/Exo2-ExtraBold.ttf') format('truetype');
    }
    @font-face {
        font-family: 'Exo 2';
        font-style: normal;
        font-weight: 900;
        src: local('Exo 2 Black'), local('Exo2-Black'), url('/fonts/Exo_2/Exo2-Black.ttf') format('truetype');
    }

    @font-face {
        font-family: 'Aero Matics Regular';
        font-style: normal;
        font-weight: 400;
        src: local('Aero Matics Regular'), local('Aero-Matics-Regular'), url('/fonts/AeroMaticsRegular/aero-matics.regular.ttf') format('truetype');
    }

    @font-face {
        font-family: 'Bernard MT Condensed';
        font-style: normal;
        font-weight: 400;
        src: local('Bernard MT Condensed'), local('Bernard-MT-Condensed'), url('/fonts/Bernard/BERNHC.ttf') format('truetype');
    }

    @font-face {
        font-family: 'Dollar Bill';
        font-style: normal;
        font-weight: 400;
        src: url('/fonts/Dollar Bill.otf') format('woff');
    }

    @font-face {
        font-family: 'Caslon RR Regular ExtraCond Diagonal';
        font-style: normal;
        font-weight: 400;
        src: local('Caslon RR Regular ExtraCond Diagonal'), local('Caslon-RR-Regular-ExtraCond-Diagonal'), url('/fonts/Caslon/Caslon RR Regular ExtraCond Diagonal.ttf') format('truetype');
    }

    @font-face {
        font-family: 'Caslon RR Regular ExtraCond Outline';
        font-style: normal;
        font-weight: 400;
        src: local('Caslon RR Regular ExtraCond Outline'), local('Caslon-RR-Regular-ExtraCond-Outline'), url('/fonts/Caslon/Caslon RR Regular ExtraCond Outline.ttf') format('truetype');
    }

    @font-face {
        font-family: 'Caslon RR Regular ExtraCond';
        font-style: normal;
        src: url('/fonts/Caslon/Caslon RR Regular ExtraCond.otf') format('woff');
    }

    @font-face {
        font-family: 'Ubuntu';
        font-style: italic;
        font-weight: 300;
        src: local('Ubuntu Light Italic'), local('Ubuntu-LightItalic'), url('/fonts/Ubuntu/Ubuntu-LightItalic.ttf') format('truetype');
    }
    @font-face {
        font-family: 'Ubuntu';
        font-style: italic;
        font-weight: 400;
        src: local('Ubuntu Italic'), local('Ubuntu-Italic'), url('/fonts/Ubuntu/Ubuntu-Italic.ttf') format('truetype');
    }
    @font-face {
        font-family: 'Ubuntu';
        font-style: italic;
        font-weight: 500;
        src: local('Ubuntu Medium Italic'), local('Ubuntu-MediumItalic'), url('/fonts/Ubuntu/Ubuntu-MediumItalic.ttf') format('truetype');
    }
    @font-face {
        font-family: 'Ubuntu';
        font-style: italic;
        font-weight: 700;
        src: local('Ubuntu Bold Italic'), local('Ubuntu-BoldItalic'), url('/fonts/Ubuntu/Ubuntu-BoldItalic.ttf') format('truetype');
    }
    @font-face {
        font-family: 'Ubuntu';
        font-style: normal;
        font-weight: 300;
        src: local('Ubuntu Light'), local('Ubuntu-Light'), url('/fonts/Ubuntu/Ubuntu-Light.ttf') format('truetype');
    }
    @font-face {
        font-family: 'Ubuntu';
        font-style: normal;
        font-weight: 400;
        src: local('Ubuntu'), local('Ubuntu-Regular'), url('/fonts/Ubuntu/Ubuntu-Regular.ttf') format('truetype');
    }
    @font-face {
        font-family: 'Ubuntu';
        font-style: normal;
        font-weight: 500;
        src: local('Ubuntu Medium'), local('Ubuntu-Medium'), url('/fonts/Ubuntu/Ubuntu-Medium.ttf') format('truetype');
    }
    @font-face {
        font-family: 'Ubuntu';
        font-style: normal;
        font-weight: 700;
        src: local('Ubuntu Bold'), local('Ubuntu-Bold'), url('/fonts/Ubuntu/Ubuntu-Bold.ttf') format('truetype');
    }

    @font-face {
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 100;
        src: local('Roboto Thin'), local('Roboto-Thin'), url('/fonts/Roboto/Roboto-Thin.ttf') format('truetype');
    }

    @font-face {
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 300;
        src: local('Roboto Light'), local('Roboto-Light'), url('/fonts/Roboto/Roboto-Light.ttf') format('truetype');
    }

    @font-face {
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 400;
        src: local('Roboto Regular'), local('Roboto-Regular'), url('/fonts/Roboto/Roboto-Regular.ttf') format('truetype');
    }

    @font-face {
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 500;
        src: local('Roboto Medium'), local('Roboto-Medium'), url('/fonts/Roboto/Roboto-Medium.ttf') format('truetype');
    }

    @font-face {
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 800;
        src: local('Roboto Bold'), local('Roboto-Bold'), url('/fonts/Roboto/Roboto-Bold.ttf') format('truetype');
    }

    @font-face {
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 900;
        src: local('Roboto Black'), local('Roboto-Black'), url('/fonts/Roboto/Roboto-Black.ttf') format('truetype');
    }

    @font-face {
        font-family: 'Roboto';
        font-style: italic;
        font-weight: 100;
        src: local('Roboto Thin Italic'), local('Roboto-ThinItalic'), url('/fonts/Roboto/Roboto-ThinItalic.ttf') format('truetype');
    }

    @font-face {
        font-family: 'Roboto';
        font-style: italic;
        font-weight: 200;
        src: local('Roboto Light Italic'), local('Roboto-LightItalic'), url('/fonts/Roboto/Roboto-LightItalic.ttf') format('truetype');
    }

    @font-face {
        font-family: 'Roboto';
        font-style: italic;
        font-weight: 400;
        src: local('Roboto Regular Italic'), local('Roboto-RegularItalic'), url('/fonts/Roboto/Roboto-RegularItalic.ttf') format('truetype');
    }

    @font-face {
        font-family: 'Roboto';
        font-style: italic;
        font-weight: 500;
        src: local('Roboto Medium Italic'), local('Roboto-MediumItalic'), url('/fonts/Roboto/Roboto-MediumItalic.ttf') format('truetype');
    }

    @font-face {
        font-family: 'Roboto';
        font-style: italic;
        font-weight: 800;
        src: local('Roboto Bold Italic'), local('Roboto-BoldItalic'), url('/fonts/Roboto/Roboto-BoldItalic.ttf') format('truetype');
    }

    @font-face {
        font-family: 'Roboto';
        font-style: italic;
        font-weight: 900;
        src: local('Roboto Black Italic'), local('Roboto-BlackItalic'), url('/fonts/Roboto/Roboto-BlackItalic.ttf') format('truetype');
    }

    html, body {
        margin: 0;
        padding: 0;
        font-family: 'Roboto';
        overflow: hidden;
    }

    .ReactTable.-highlight .rt-tbody .rt-tr:not(.-padRow):hover {
        background:rgba(0,0,0,0.3) !important;
    }

    .ReactTable .rt-td {
        padding: 0px !important;
        align-self: center;
    }

    .ReactTable {
        font-family: 'open_sans', sans-serif;
        font-size: .8rem;
        letter-spacing: .025rem;
    }

     /* turns off no-data message if table is empty */
    .rt-noData {
        display: none !important;
    }

    .tableRows {
        font-size: 1rem;
        padding-top : .8rem;
        padding-bottom : .8rem;
        padding-left: 0.2rem;
        
        & div {
            font-size: 1rem;
        }

        @media (max-width: 1850px) {
            font-size: .8rem;
            padding-top: .7rem;
            padding-bottom: .7rem;
            
            & div {
                font-size: .8rem;
            }
        }
    }

    /* being used to target currently */
    .tableRowsStreaming {
        padding-top: 5px;
        padding-bottom: 5px;
    }

    /* hide arorrws on all inputs of type number */
    input[type='number'] {
        -moz-appearance:textfield;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }

    /* chrome hide scrollbar */
    ::-webkit-scrollbar {
        width: 0px;  /* remove scrollbar space */
        background: transparent;  /* optional: just make scrollbar invisible */
    }
    
    /*
     * Perfect Scroll Bar
     */
     
    /*
     * Container style
     */
    .ps {
        overflow-y: hidden !important;
        overflow-anchor: none;
        -ms-overflow-style: none;
        touch-action: auto;
        -ms-touch-action: auto;
    
        .ps__rail-x:hover,
        .ps__rail-y:hover,
        .ps__rail-x:focus,
        .ps__rail-y:focus,
        .ps__rail-x.ps--clicking,
        .ps__rail-y.ps--clicking {
            background-color: transparent;
            opacity: 1
        }
    }
    
    /*
     * Scrollbar rail styles
     */
    .ps__rail-x {
        display: none;
        opacity: 0;
        transition: background-color .2s linear, opacity .2s linear;
        -webkit-transition: background-color .2s linear, opacity .2s linear;
        height: 15px;
        /* there must be 'bottom' or 'top' for ps__rail-x */
        bottom: 0px;
        /* please don't change 'position' */
        position: absolute;
        z-index: 99;
    }
    
    .ps__rail-y {
        display: none;
        opacity: 0;
        transition: background-color .2s linear, opacity .2s linear;
        -webkit-transition: background-color .2s linear, opacity .2s linear;
        width: 15px;
        /* there must be 'right' or 'left' for ps__rail-y */
        right: 0;
        /* please don't change 'position' */
        position: absolute;
        z-index: 99;
    }
    
    .showscroll {
        .ps__rail-x,
        .ps__rail-y {
            transition: background-color .2s linear, opacity .2s linear;
            opacity: 1 !important;
        }
    }
    
    .ps--active-x > .ps__rail-x,
    .ps--active-y > .ps__rail-y {
        display: block;
        background-color: transparent;
    }
    
    .ps:hover > .ps__rail-x,
    .ps:hover > .ps__rail-y,
    .ps--focus > .ps__rail-x,
    .ps--focus > .ps__rail-y,
    .ps--scrolling-x > .ps__rail-x,
    .ps--scrolling-y > .ps__rail-y {
        opacity: 1;
    }
    
    /*
     * Scrollbar thumb styles
     */
    .ps__thumb-x {
        border-radius: 6px;
        transition: background-color .2s linear, height .2s ease-in-out;
        -webkit-transition: background-color .2s linear, height .2s ease-in-out;
        height: 6px;
        /* there must be 'bottom' for ps__thumb-x */
        bottom: 4px;
        /* please don't change 'position' */
        position: absolute;
        
        background: transparent; 
            
        &:before {
            content: ' ';
            position: absolute;
            top: 0;
            left: 5px;
            bottom: 0;
            right: 5px;
            display: block;
            border-radius: 5px;
            background: #24425b;
        }
    }
    
    .ps__thumb-y {
        border-radius: 6px;
        transition: background-color .2s linear, width .2s ease-in-out;
        -webkit-transition: background-color .2s linear, width .2s ease-in-out;
        width: 6px;
        /* there must be 'right' for ps__thumb-y */
        right: 4px;
        /* please don't change 'position' */
        position: absolute;
        
        background: transparent; 
            
        &:before {
            content: ' ';
            position: absolute;
            top: 5px;
            left: 0;
            bottom: 5px;
            right: 0;
            display: block;
            border-radius: 5px;
            background: #24425b;
        }
    }
    
    .ps__rail-x:hover > .ps__thumb-x,
    .ps__rail-x:focus > .ps__thumb-x,
    .ps__rail-x.ps--clicking .ps__thumb-x {
        // background-color: #999;
        // height: 11px;
    }
    
    .ps__rail-y:hover > .ps__thumb-y,
    .ps__rail-y:focus > .ps__thumb-y,
    .ps__rail-y.ps--clicking .ps__thumb-y {
        // background-color: #999;
        // width: 11px;
    }
    
    /* MS supports */
    @supports (-ms-overflow-style: none) {
        .ps {
            overflow: auto !important;
        }
    }
    
    @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
        .ps {
            overflow: auto !important;
        }
    }
    
    .scrollbar-container {
        position: relative;
        height: 100%; 
    }

    .scroll__scrollup {
        font-size: 9px;
        border: 1px solid #7f8bc2;
        border-radius: 5px;

        position: absolute;
        right: 12px;
        bottom: 12px;
        background: rgba(13, 17, 43, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 100;
        opacity: 1;
        transition: .3s;

        .scroll-up-button {
            padding: 0 4px;
            text-align: center;
            line-height: 9px;
            height: 100%;
            border: 0;
            justify-content: center;
            cursor: pointer;
            background: transparent;
        
            .sprite-icon {
                width: 20px;
                height: 28px;
                fill: #7f8bc2;
                margin: 0;
            }
    
            &:hover {                
                .sprite-icon {
                    fill: #fff;
                }
            }
            
            &.scroll-down {
                transform: rotate(180deg);
            }
        }

        &:hover {
            background: rgba(13, 17, 43, 1);
        }
        
        &.hide {
          opacity: 0;
        }
    }

    /*
     * Tippy tooltip
     */
    .tippy-popper {
        max-width: 800px !important;
    }

    .tippy-tooltip {
        font-size: 16px;
        pointer-events: none;
    
        &.bct-theme {
            padding: 4px;
            background: #080924;
            border-radius: 3px;
            border: 1px solid #454c73;
            box-shadow: 0 3px 3px rgba(0, 0, 0, 0.35);
            color: #7F8BC2 !important;
            text-align: left;
            
            .arrow-regular {
                // border-color: #747BA6;
                border-color: transparent;
            }
            
            .volume-tooltip {
                font-size: 20px !important;
            }
        }

        &.orderbook-theme,
        &.orderbook-sell-theme {
            margin-left: 4px;
            padding: 0px 4px;
            background: #0D112B;
            border: 1px solid #747BA6;
            box-shadow: 0 3px 3px rgba(0, 0, 0, 0.35);
            color: #7F8BC2 !important;
            text-align: left;
            
            .volume-tooltip {
                font-size: 20px !important;
            }
        }

        &.wallet-theme {
            padding: 4px 8px;
            background: #0D112B;
            border: 1px solid #747BA6;
            box-shadow: 0 3px 3px rgba(0, 0, 0, 0.35);
            color: #7F8BC2 !important;
            text-align: left;
            
            .arrow-regular {
                // border-color: #747BA6;
                border-color: transparent;
            }
        }
    
        /*&.bct-advanced-theme {
            background: #18202d !important;
            color: #9ba6b2 !important;
            border: 1px solid #24425b !important;
            padding: 5px 7px 3px;
            box-shadow: 0 3px 3px rgba(0, 0, 0, 0.35);
        }*/
        
        .advanced-tooltip {
            list-style-type: none;
            padding: 6px 8px;
            margin: 0;
            &.text-left {
                text-align: left !important;
            }
        }

        .advanced-tooltip.orderbook-tooltip {
            padding: 0px 8px;

            li span {
                padding-top: 3px;
                padding-bottom: 3px;
            }
            li:first-child span { 
                padding-top: 10px;
            }

            li:last-child span { 
                padding-bottom: 10px;
            }
        }

        @media(max-width: 1500px) {
            .advanced-tooltip.text-left span {
                font-size: 13px !important;
                transform: unset !important;
            }
        }
        
        @media(max-width: 1080px) { 
            transform:scale(0.75) !important;
        }
        
        @media(max-width: 940px) {
            transform:scale(0.75) !important;
        }
        
        @media(max-width: 790px) {
            transform:scale(0.75) !important;
        }
        
        @media(max-width: 700px) {
            transform:scale(0.75) !important;
        }
    }
    
    .basic-table .tippy-tooltip .tippy-content {
        white-space: pre-line;
    }
    
    .tippy-popper {
        z-index: 10000001 !important;
        pointer-events: initial !important;
    }
    
    .tippy-popper[x-placement^=right] .tippy-tooltip.bct-theme .arrow-regular {
        border-right: 7px solid !important;
        margin-top: 4px;
        
        @media(max-width: 768px) {
            display: none;
        }
    }

    .tippy-popper[x-placement^=left] .tippy-tooltip.bct-theme .arrow-regular {
        border-left: 7px solid !important;
        margin-top: 4px;
        
        @media(max-width: 768px) {
            display: none;
        }
    }

    .tippy-popper[x-placement^=top] .tippy-tooltip.bct-theme .arrow-regular {
        border-top: 7px solid !important;
        
        @media(max-width: 768px) {
            display: none;
        }
    }

    .tippy-popper[x-placement^=bottom] .tippy-tooltip.bct-theme .arrow-regular {
        border-bottom: 7px solid !important;
        
        @media(max-width: 768px) {
            display: none;
        }
    }

    .tippy-popper[x-placement^=right] .tippy-tooltip.wallet-theme .arrow-regular {
        border-right: 7px solid !important;
        border-right-color: #747ba6 !important;
        margin-top: 4px;
        
        @media(max-width: 768px) {
            display: none;
        }
    }

    .tippy-popper[x-placement^=left] .tippy-tooltip.wallet-theme .arrow-regular {
        border-left: 7px solid !important;
        border-left-color: #747ba6 !important;
        margin-top: 4px;
        
        @media(max-width: 768px) {
            display: none;
        }
    }

    .tippy-popper[x-placement^=top] .tippy-tooltip.wallet-theme .arrow-regular {
        border-top: 7px solid !important;
        border-top-color: #747ba6 !important;
        
        @media(max-width: 768px) {
            display: none;
        }
    }

    .tippy-popper[x-placement^=bottom] .tippy-tooltip.wallet-theme .arrow-regular {
        border-bottom: 7px solid !important;
        border-bottom-color: #747ba6 !important;
        
        @media(max-width: 768px) {
            display: none;
        }
    }

    .tippy-popper[x-placement^=right] .tippy-tooltip.orderbook-theme .arrow-regular,
    .tippy-popper[x-placement^=right] .tippy-tooltip.orderbook-sell-theme .arrow-regular {
        border-right: 7px solid !important;
        border-right-color: #68b168 !important;
        margin-top: 4px;
        
        @media(max-width: 768px) {
            display: none;
        }
    }

    .tippy-popper[x-placement^=left] .tippy-tooltip.orderbook-theme .arrow-regular,
    .tippy-popper[x-placement^=left] .tippy-tooltip.orderbook-sell-theme .arrow-regular {
        border-left: 7px solid !important;
        border-left-color: #68b168 !important;
        margin-top: 4px;
        
        @media(max-width: 768px) {
            display: none;
        }
    }

    .tippy-popper[x-placement^=top] .tippy-tooltip.orderbook-theme .arrow-regular,
    .tippy-popper[x-placement^=top] .tippy-tooltip.orderbook-sell-theme .arrow-regular {
        border-top: 7px solid !important;
        border-top-color: #68b168 !important;
        
        @media(max-width: 768px) {
            display: none;
        }
    }

    .tippy-popper[x-placement^=bottom] .tippy-tooltip.orderbook-theme .arrow-regular,
    .tippy-popper[x-placement^=bottom] .tippy-tooltip.orderbook-sell-theme .arrow-regular {
        border-bottom: 7px solid !important;
        border-bottom-color: #68b168 !important;
        
        @media(max-width: 768px) {
            display: none;
        }
    }

    .tippy-popper[x-placement^=right] .tippy-tooltip.orderbook-sell-theme .arrow-regular {
        border-right-color: #0A84D6 !important;
    }
    .tippy-popper[x-placement^=left] .tippy-tooltip.orderbook-sell-theme .arrow-regular {
        border-left-color: #0A84D6 !important;

    }
    .tippy-popper[x-placement^=top] .tippy-tooltip.orderbook-sell-theme .arrow-regular {
        border-top-color: #0A84D6 !important;

    }
    .tippy-popper[x-placement^=bottom] .tippy-tooltip.orderbook-sell-theme .arrow-regular {
        border-bottom-color: #0A84D6 !important;
    }

    /*
     * linkify
     */
    .linkify {
        margin: 0;
    }

    .linkified {
        color: #3a6d99;
        text-decoration: none;
    
        &:hover {
            text-decoration: underline;
        }
    }
    
    .lm_controls .lm_maximise {
        background: url('/img/fullscreen.png') no-repeat center;
        background-size: auto 100%;
    }
    
    .lm_maximised .lm_controls .lm_maximise {
        background-image: url('/img/minimize.png');
    }
    
    .exch-dropdown__icon {
        border-radius: 50% !important;
        flex-shrink: 0;
    }

    /*
     * Flex!
     */
    .d-none {
        display: none !important;
    }
    
    .d-inline {
        display: inline !important;
    }
    
    .d-inline-block {
        display: inline-block !important;
    }
    
    .d-block {
        display: block !important;
    }
    
    .d-table {
        display: table !important;
    }
    
    .d-table-row {
        display: table-row !important;
    }
    
    .d-table-cell {
        display: table-cell !important;
    }
    
    .d-flex {
        display: -ms-flexbox !important;
        display: flex !important;
    }
    
    .d-inline-flex {
        display: -ms-inline-flexbox !important;
        display: inline-flex !important;
    }
    
    .flex-row {
        -ms-flex-direction: row !important;
        flex-direction: row !important;
    }
    
    .flex-column {
        -ms-flex-direction: column !important;
        flex-direction: column !important;
    }
    
    .flex-row-reverse {
        -ms-flex-direction: row-reverse !important;
        flex-direction: row-reverse !important;
    }
    
    .flex-column-reverse {
        -ms-flex-direction: column-reverse !important;
        flex-direction: column-reverse !important;
    }
    
    .flex-wrap {
        -ms-flex-wrap: wrap !important;
        flex-wrap: wrap !important;
    }
    
    .flex-nowrap {
        -ms-flex-wrap: nowrap !important;
        flex-wrap: nowrap !important;
    }
    
    .flex-wrap-reverse {
        -ms-flex-wrap: wrap-reverse !important;
        flex-wrap: wrap-reverse !important;
    }
    
    .flex-fill {
        -ms-flex: 1 1 auto !important;
        flex: 1 1 auto !important;
    }
    
    .flex-grow-0 {
        -ms-flex-positive: 0 !important;
        flex-grow: 0 !important;
    }
    
    .flex-grow-1 {
        -ms-flex-positive: 1 !important;
        flex-grow: 1 !important;
    }
    
    .flex-shrink-0 {
        -ms-flex-negative: 0 !important;
        flex-shrink: 0 !important;
    }
    
    .flex-shrink-1 {
        -ms-flex-negative: 1 !important;
        flex-shrink: 1 !important;
    }
    
    .justify-content-start {
        -ms-flex-pack: start !important;
        justify-content: flex-start !important;
    }
    
    .justify-content-end {
        -ms-flex-pack: end !important;
        justify-content: flex-end !important;
    }
    
    .justify-content-center {
        -ms-flex-pack: center !important;
        justify-content: center !important;
    }
    
    .justify-content-between {
        -ms-flex-pack: justify !important;
        justify-content: space-between !important;
    }
    
    .justify-content-around {
        -ms-flex-pack: distribute !important;
        justify-content: space-around !important;
    }
    
    .align-items-start {
        -ms-flex-align: start !important;
        align-items: flex-start !important;
    }
    
    .align-items-end {
        -ms-flex-align: end !important;
        align-items: flex-end !important;
    }
    
    .align-items-center {
        -ms-flex-align: center !important;
        align-items: center !important;
    }
    
    .align-items-baseline {
        -ms-flex-align: baseline !important;
        align-items: baseline !important;
    }
    
    .align-items-stretch {
        -ms-flex-align: stretch !important;
        align-items: stretch !important;
    }
    
    .align-content-start {
        -ms-flex-line-pack: start !important;
        align-content: flex-start !important;
    }
    
    .align-content-end {
        -ms-flex-line-pack: end !important;
        align-content: flex-end !important;
    }
    
    .align-content-center {
        -ms-flex-line-pack: center !important;
        align-content: center !important;
    }
    
    .align-content-between {
        -ms-flex-line-pack: justify !important;
        align-content: space-between !important;
    }
    
    .align-content-around {
        -ms-flex-line-pack: distribute !important;
        align-content: space-around !important;
    }
    
    .align-content-stretch {
        -ms-flex-line-pack: stretch !important;
        align-content: stretch !important;
    }
    
    .align-self-auto {
        -ms-flex-item-align: auto !important;
        align-self: auto !important;
    }
    
    .align-self-start {
        -ms-flex-item-align: start !important;
        align-self: flex-start !important;
    }
    
    .align-self-end {
        -ms-flex-item-align: end !important;
        align-self: flex-end !important;
    }
    
    .align-self-center {
        -ms-flex-item-align: center !important;
        align-self: center !important;
    }
    
    .align-self-baseline {
        -ms-flex-item-align: baseline !important;
        align-self: baseline !important;
    }
    
    .align-self-stretch {
        -ms-flex-item-align: stretch !important;
        align-self: stretch !important;
    }
    
    .full-width {
        width: 100%;
    }
    
    /* Animations */
    @keyframes animation-appear {
        0% { opacity: 0; }
        100% { opacity: 1; }
    }
    
    @keyframes animation-disappear {
        0% { opacity: 1; }
        100% { opacity: 0; }
    }

    .animate-appear {
        display: block;
    }
    
    .animate-disappear {
        display: none;
    }
    
    .ml-auto {
        margin-left: auto !important;
    }
    
    .mt-auto {
        margin-top: auto !important;
    }
    
    .full-width {
        width: 100% !important;
    }
    
    .pl-none {
        padding-left: 0 !important;
    }
    
    .pointer-disabled {
        pointer-events: none !important;
    }
    
    .intl-flag {
        width: 20px;
        height: 15px;
        box-shadow: 0px 0px 1px 0px #888;
        background-image: url("/img/country_flags.png");
        background-repeat: no-repeat;
        background-color: #DBDBDB;
        background-position: 20px 0;
        
        &.be {
            width: 18px;
        }
        
        &.ch {
            width: 15px;
        }
        
        &.mc {
            width: 19px;
        }
        
        &.ne {
            width: 18px;
        }
        
        &.np {
            width: 13px;
        }
        
        &.va {
            width: 15px;
        }
        
        &.ac {
            height: 10px;
            background-position: 0px 0px;
        }
        
        &.ad {
            height: 14px;
            background-position: -22px 0px;
        }
        
        &.ae {
            height: 10px;
            background-position: -44px 0px;
        }
        
        &.af {
            height: 14px;
            background-position: -66px 0px;
        }
        
        &.ag {
            height: 14px;
            background-position: -88px 0px;
        }
        
        &.ai {
            height: 10px;
            background-position: -110px 0px;
        }
        
        &.al {
            height: 15px;
            background-position: -132px 0px;
        }
        
        &.am {
            height: 10px;
            background-position: -154px 0px;
        }
        
        &.ao {
            height: 14px;
            background-position: -176px 0px;
        }
        
        &.aq {
            height: 14px;
            background-position: -198px 0px;
        }
        
        &.ar {
            height: 13px;
            background-position: -220px 0px;
        }
        
        &.as {
            height: 10px;
            background-position: -242px 0px;
        }
        
        &.at {
            height: 14px;
            background-position: -264px 0px;
        }
        
        &.au {
            height: 10px;
            background-position: -286px 0px;
        }
        
        &.aw {
            height: 14px;
            background-position: -308px 0px;
        }
        
        &.ax {
            height: 13px;
            background-position: -330px 0px;
        }
        
        &.az {
            height: 10px;
            background-position: -352px 0px;
        }
        
        &.ba {
            height: 10px;
            background-position: -374px 0px;
        }
        
        &.bb {
            height: 14px;
            background-position: -396px 0px;
        }
        
        &.bd {
            height: 12px;
            background-position: -418px 0px;
        }
        
        &.be {
            height: 15px;
            background-position: -440px 0px;
        }
        
        &.bf {
            height: 14px;
            background-position: -460px 0px;
        }
        
        &.bg {
            height: 12px;
            background-position: -482px 0px;
        }
        
        &.bh {
            height: 12px;
            background-position: -504px 0px;
        }
        
        &.bi {
            height: 12px;
            background-position: -526px 0px;
        }
        
        &.bj {
            height: 14px;
            background-position: -548px 0px;
        }
        
        &.bl {
            height: 14px;
            background-position: -570px 0px;
        }
        
        &.bm {
            height: 10px;
            background-position: -592px 0px;
        }
        
        &.bn {
            height: 10px;
            background-position: -614px 0px;
        }
        
        &.bo {
            height: 14px;
            background-position: -636px 0px;
        }
        
        &.bq {
            height: 14px;
            background-position: -658px 0px;
        }
        
        &.br {
            height: 14px;
            background-position: -680px 0px;
        }
        
        &.bs {
            height: 10px;
            background-position: -702px 0px;
        }
        
        &.bt {
            height: 14px;
            background-position: -724px 0px;
        }
        
        &.bv {
            height: 15px;
            background-position: -746px 0px;
        }
        
        &.bw {
            height: 14px;
            background-position: -768px 0px;
        }
        
        &.by {
            height: 10px;
            background-position: -790px 0px;
        }
        
        &.bz {
            height: 14px;
            background-position: -812px 0px;
        }
        
        &.ca {
            height: 10px;
            background-position: -834px 0px;
        }
        
        &.cc {
            height: 10px;
            background-position: -856px 0px;
        }
        
        &.cd {
            height: 15px;
            background-position: -878px 0px;
        }
        
        &.cf {
            height: 14px;
            background-position: -900px 0px;
        }
        
        &.cg {
            height: 14px;
            background-position: -922px 0px;
        }
        
        &.ch {
            height: 15px;
            background-position: -944px 0px;
        }
        
        &.ci {
            height: 14px;
            background-position: -961px 0px;
        }
        
        &.ck {
            height: 10px;
            background-position: -983px 0px;
        }
        
        &.cl {
            height: 14px;
            background-position: -1005px 0px;
        }
        
        &.cm {
            height: 14px;
            background-position: -1027px 0px;
        }
        
        &.cn {
            height: 14px;
            background-position: -1049px 0px;
        }
        
        &.co {
            height: 14px;
            background-position: -1071px 0px;
        }
        
        &.cp {
            height: 14px;
            background-position: -1093px 0px;
        }
        
        &.cr {
            height: 12px;
            background-position: -1115px 0px;
        }
        
        &.cu {
            height: 10px;
            background-position: -1137px 0px;
        }
        
        &.cv {
            height: 12px;
            background-position: -1159px 0px;
        }
        
        &.cw {
            height: 14px;
            background-position: -1181px 0px;
        }
        
        &.cx {
            height: 10px;
            background-position: -1203px 0px;
        }
        
        &.cy {
            height: 14px;
            background-position: -1225px 0px;
        }
        
        &.cz {
            height: 14px;
            background-position: -1247px 0px;
        }
        
        &.de {
            height: 12px;
            background-position: -1269px 0px;
        }
        
        &.dg {
            height: 10px;
            background-position: -1291px 0px;
        }
        
        &.dj {
            height: 14px;
            background-position: -1313px 0px;
        }
        
        &.dk {
            height: 15px;
            background-position: -1335px 0px;
        }
        
        &.dm {
            height: 10px;
            background-position: -1357px 0px;
        }
        
        &.do {
            height: 14px;
            background-position: -1379px 0px;
        }
        
        &.dz {
            height: 14px;
            background-position: -1401px 0px;
        }
        
        &.ea {
            height: 14px;
            background-position: -1423px 0px;
        }
        
        &.ec {
            height: 14px;
            background-position: -1445px 0px;
        }
        
        &.ee {
            height: 13px;
            background-position: -1467px 0px;
        }
        
        &.eg {
            height: 14px;
            background-position: -1489px 0px;
        }
        
        &.eh {
            height: 10px;
            background-position: -1511px 0px;
        }
        
        &.er {
            height: 10px;
            background-position: -1533px 0px;
        }
        
        &.es {
            height: 14px;
            background-position: -1555px 0px;
        }
        
        &.et {
            height: 10px;
            background-position: -1577px 0px;
        }
        
        &.eu {
            height: 14px;
            background-position: -1599px 0px;
        }
        
        &.fi {
            height: 12px;
            background-position: -1621px 0px;
        }
        
        &.fj {
            height: 10px;
            background-position: -1643px 0px;
        }
        
        &.fk {
            height: 10px;
            background-position: -1665px 0px;
        }
        
        &.fm {
            height: 11px;
            background-position: -1687px 0px;
        }
        
        &.fo {
            height: 15px;
            background-position: -1709px 0px;
        }
        
        &.fr {
            height: 14px;
            background-position: -1731px 0px;
        }
        
        &.ga {
            height: 15px;
            background-position: -1753px 0px;
        }
        
        &.gb {
            height: 10px;
            background-position: -1775px 0px;
        }
        
        &.gd {
            height: 12px;
            background-position: -1797px 0px;
        }
        
        &.ge {
            height: 14px;
            background-position: -1819px 0px;
        }
        
        &.gf {
            height: 14px;
            background-position: -1841px 0px;
        }
        
        &.gg {
            height: 14px;
            background-position: -1863px 0px;
        }
        
        &.gh {
            height: 14px;
            background-position: -1885px 0px;
        }
        
        &.gi {
            height: 10px;
            background-position: -1907px 0px;
        }
        
        &.gl {
            height: 14px;
            background-position: -1929px 0px;
        }
        
        &.gm {
            height: 14px;
            background-position: -1951px 0px;
        }
        
        &.gn {
            height: 14px;
            background-position: -1973px 0px;
        }
        
        &.gp {
            height: 14px;
            background-position: -1995px 0px;
        }
        
        &.gq {
            height: 14px;
            background-position: -2017px 0px;
        }
        
        &.gr {
            height: 14px;
            background-position: -2039px 0px;
        }
        
        &.gs {
            height: 10px;
            background-position: -2061px 0px;
        }
        
        &.gt {
            height: 13px;
            background-position: -2083px 0px;
        }
        
        &.gu {
            height: 11px;
            background-position: -2105px 0px;
        }
        
        &.gw {
            height: 10px;
            background-position: -2127px 0px;
        }
        
        &.gy {
            height: 12px;
            background-position: -2149px 0px;
        }
        
        &.hk {
            height: 14px;
            background-position: -2171px 0px;
        }
        
        &.hm {
            height: 10px;
            background-position: -2193px 0px;
        }
        
        &.hn {
            height: 10px;
            background-position: -2215px 0px;
        }
        
        &.hr {
            height: 10px;
            background-position: -2237px 0px;
        }
        
        &.ht {
            height: 12px;
            background-position: -2259px 0px;
        }
        
        &.hu {
            height: 10px;
            background-position: -2281px 0px;
        }
        
        &.ic {
            height: 14px;
            background-position: -2303px 0px;
        }
        
        &.id {
            height: 14px;
            background-position: -2325px 0px;
        }
        
        &.ie {
            height: 10px;
            background-position: -2347px 0px;
        }
        
        &.il {
            height: 15px;
            background-position: -2369px 0px;
        }
        
        &.im {
            height: 10px;
            background-position: -2391px 0px;
        }
        
        &.in {
            height: 14px;
            background-position: -2413px 0px;
        }
        
        &.io {
            height: 10px;
            background-position: -2435px 0px;
        }
        
        &.iq {
            height: 14px;
            background-position: -2457px 0px;
        }
        
        &.ir {
            height: 12px;
            background-position: -2479px 0px;
        }
        
        &.is {
            height: 15px;
            background-position: -2501px 0px;
        }
        
        &.it {
            height: 14px;
            background-position: -2523px 0px;
        }
        
        &.je {
            height: 12px;
            background-position: -2545px 0px;
        }
        
        &.jm {
            height: 10px;
            background-position: -2567px 0px;
        }
        
        &.jo {
            height: 10px;
            background-position: -2589px 0px;
        }
        
        &.jp {
            height: 14px;
            background-position: -2611px 0px;
        }
        
        &.ke {
            height: 14px;
            background-position: -2633px 0px;
        }
        
        &.kg {
            height: 12px;
            background-position: -2655px 0px;
        }
        
        &.kh {
            height: 13px;
            background-position: -2677px 0px;
        }
        
        &.ki {
            height: 10px;
            background-position: -2699px 0px;
        }
        
        &.km {
            height: 12px;
            background-position: -2721px 0px;
        }
        
        &.kn {
            height: 14px;
            background-position: -2743px 0px;
        }
        
        &.kp {
            height: 10px;
            background-position: -2765px 0px;
        }
        
        &.kr {
            height: 14px;
            background-position: -2787px 0px;
        }
        
        &.kw {
            height: 10px;
            background-position: -2809px 0px;
        }
        
        &.ky {
            height: 10px;
            background-position: -2831px 0px;
        }
        
        &.kz {
            height: 10px;
            background-position: -2853px 0px;
        }
        
        &.la {
            height: 14px;
            background-position: -2875px 0px;
        }
        
        &.lb {
            height: 14px;
            background-position: -2897px 0px;
        }
        
        &.lc {
            height: 10px;
            background-position: -2919px 0px;
        }
        
        &.li {
            height: 12px;
            background-position: -2941px 0px;
        }
        
        &.lk {
            height: 10px;
            background-position: -2963px 0px;
        }
        
        &.lr {
            height: 11px;
            background-position: -2985px 0px;
        }
        
        &.ls {
            height: 14px;
            background-position: -3007px 0px;
        }
        
        &.lt {
            height: 12px;
            background-position: -3029px 0px;
        }
        
        &.lu {
            height: 12px;
            background-position: -3051px 0px;
        }
        
        &.lv {
            height: 10px;
            background-position: -3073px 0px;
        }
        
        &.ly {
            height: 10px;
            background-position: -3095px 0px;
        }
        
        &.ma {
            height: 14px;
            background-position: -3117px 0px;
        }
        
        &.mc {
            height: 15px;
            background-position: -3139px 0px;
        }
        
        &.md {
            height: 10px;
            background-position: -3160px 0px;
        }
        
        &.me {
            height: 10px;
            background-position: -3182px 0px;
        }
        
        &.mf {
            height: 14px;
            background-position: -3204px 0px;
        }
        
        &.mg {
            height: 14px;
            background-position: -3226px 0px;
        }
        
        &.mh {
            height: 11px;
            background-position: -3248px 0px;
        }
        
        &.mk {
            height: 10px;
            background-position: -3270px 0px;
        }
        
        &.ml {
            height: 14px;
            background-position: -3292px 0px;
        }
        
        &.mm {
            height: 14px;
            background-position: -3314px 0px;
        }
        
        &.mn {
            height: 10px;
            background-position: -3336px 0px;
        }
        
        &.mo {
            height: 14px;
            background-position: -3358px 0px;
        }
        
        &.mp {
            height: 10px;
            background-position: -3380px 0px;
        }
        
        &.mq {
            height: 14px;
            background-position: -3402px 0px;
        }
        
        &.mr {
            height: 14px;
            background-position: -3424px 0px;
        }
        
        &.ms {
            height: 10px;
            background-position: -3446px 0px;
        }
        
        &.mt {
            height: 14px;
            background-position: -3468px 0px;
        }
        
        &.mu {
            height: 14px;
            background-position: -3490px 0px;
        }
        
        &.mv {
            height: 14px;
            background-position: -3512px 0px;
        }
        
        &.mw {
            height: 14px;
            background-position: -3534px 0px;
        }
        
        &.mx {
            height: 12px;
            background-position: -3556px 0px;
        }
        
        &.my {
            height: 10px;
            background-position: -3578px 0px;
        }
        
        &.mz {
            height: 14px;
            background-position: -3600px 0px;
        }
        
        &.na {
            height: 14px;
            background-position: -3622px 0px;
        }
        
        &.nc {
            height: 10px;
            background-position: -3644px 0px;
        }
        
        &.ne {
            height: 15px;
            background-position: -3666px 0px;
        }
        
        &.nf {
            height: 10px;
            background-position: -3686px 0px;
        }
        
        &.ng {
            height: 10px;
            background-position: -3708px 0px;
        }
        
        &.ni {
            height: 12px;
            background-position: -3730px 0px;
        }
        
        &.nl {
            height: 14px;
            background-position: -3752px 0px;
        }
        
        &.no {
            height: 15px;
            background-position: -3774px 0px;
        }
        
        &.np {
            height: 15px;
            background-position: -3796px 0px;
        }
        
        &.nr {
            height: 10px;
            background-position: -3811px 0px;
        }
        
        &.nu {
            height: 10px;
            background-position: -3833px 0px;
        }
        
        &.nz {
            height: 10px;
            background-position: -3855px 0px;
        }
        
        &.om {
            height: 10px;
            background-position: -3877px 0px;
        }
        
        &.pa {
            height: 14px;
            background-position: -3899px 0px;
        }
        
        &.pe {
            height: 14px;
            background-position: -3921px 0px;
        }
        
        &.pf {
            height: 14px;
            background-position: -3943px 0px;
        }
        
        &.pg {
            height: 15px;
            background-position: -3965px 0px;
        }
        
        &.ph {
            height: 10px;
            background-position: -3987px 0px;
        }
        
        &.pk {
            height: 14px;
            background-position: -4009px 0px;
        }
        
        &.pl {
            height: 13px;
            background-position: -4031px 0px;
        }
        
        &.pm {
            height: 14px;
            background-position: -4053px 0px;
        }
        
        &.pn {
            height: 10px;
            background-position: -4075px 0px;
        }
        
        &.pr {
            height: 14px;
            background-position: -4097px 0px;
        }
        
        &.ps {
            height: 10px;
            background-position: -4119px 0px;
        }
        
        &.pt {
            height: 14px;
            background-position: -4141px 0px;
        }
        
        &.pw {
            height: 13px;
            background-position: -4163px 0px;
        }
        
        &.py {
            height: 11px;
            background-position: -4185px 0px;
        }
        
        &.qa {
            height: 8px;
            background-position: -4207px 0px;
        }
        
        &.re {
            height: 14px;
            background-position: -4229px 0px;
        }
        
        &.ro {
            height: 14px;
            background-position: -4251px 0px;
        }
        
        &.rs {
            height: 14px;
            background-position: -4273px 0px;
        }
        
        &.ru {
            height: 14px;
            background-position: -4295px 0px;
        }
        
        &.rw {
            height: 14px;
            background-position: -4317px 0px;
        }
        
        &.sa {
            height: 14px;
            background-position: -4339px 0px;
        }
        
        &.sb {
            height: 10px;
            background-position: -4361px 0px;
        }
        
        &.sc {
            height: 10px;
            background-position: -4383px 0px;
        }
        
        &.sd {
            height: 10px;
            background-position: -4405px 0px;
        }
        
        &.se {
            height: 13px;
            background-position: -4427px 0px;
        }
        
        &.sg {
            height: 14px;
            background-position: -4449px 0px;
        }
        
        &.sh {
            height: 10px;
            background-position: -4471px 0px;
        }
        
        &.si {
            height: 10px;
            background-position: -4493px 0px;
        }
        
        &.sj {
            height: 15px;
            background-position: -4515px 0px;
        }
        
        &.sk {
            height: 14px;
            background-position: -4537px 0px;
        }
        
        &.sl {
            height: 14px;
            background-position: -4559px 0px;
        }
        
        &.sm {
            height: 15px;
            background-position: -4581px 0px;
        }
        
        &.sn {
            height: 14px;
            background-position: -4603px 0px;
        }
        
        &.so {
            height: 14px;
            background-position: -4625px 0px;
        }
        
        &.sr {
            height: 14px;
            background-position: -4647px 0px;
        }
        
        &.ss {
            height: 10px;
            background-position: -4669px 0px;
        }
        
        &.st {
            height: 10px;
            background-position: -4691px 0px;
        }
        
        &.sv {
            height: 12px;
            background-position: -4713px 0px;
        }
        
        &.sx {
            height: 14px;
            background-position: -4735px 0px;
        }
        
        &.sy {
            height: 14px;
            background-position: -4757px 0px;
        }
        
        &.sz {
            height: 14px;
            background-position: -4779px 0px;
        }
        
        &.ta {
            height: 10px;
            background-position: -4801px 0px;
        }
        
        &.tc {
            height: 10px;
            background-position: -4823px 0px;
        }
        
        &.td {
            height: 14px;
            background-position: -4845px 0px;
        }
        
        &.tf {
            height: 14px;
            background-position: -4867px 0px;
        }
        
        &.tg {
            height: 13px;
            background-position: -4889px 0px;
        }
        
        &.th {
            height: 14px;
            background-position: -4911px 0px;
        }
        
        &.tj {
            height: 10px;
            background-position: -4933px 0px;
        }
        
        &.tk {
            height: 10px;
            background-position: -4955px 0px;
        }
        
        &.tl {
            height: 10px;
            background-position: -4977px 0px;
        }
        
        &.tm {
            height: 14px;
            background-position: -4999px 0px;
        }
        
        &.tn {
            height: 14px;
            background-position: -5021px 0px;
        }
        
        &.to {
            height: 10px;
            background-position: -5043px 0px;
        }
        
        &.tr {
            height: 14px;
            background-position: -5065px 0px;
        }
        
        &.tt {
            height: 12px;
            background-position: -5087px 0px;
        }
        
        &.tv {
            height: 10px;
            background-position: -5109px 0px;
        }
        
        &.tw {
            height: 14px;
            background-position: -5131px 0px;
        }
        
        &.tz {
            height: 14px;
            background-position: -5153px 0px;
        }
        
        &.ua {
            height: 14px;
            background-position: -5175px 0px;
        }
        
        &.ug {
            height: 14px;
            background-position: -5197px 0px;
        }
        
        &.um {
            height: 11px;
            background-position: -5219px 0px;
        }
        
        &.un {
            height: 14px;
            background-position: -5241px 0px;
        }
        
        &.us {
            height: 11px;
            background-position: -5263px 0px;
        }
        
        &.uy {
            height: 14px;
            background-position: -5285px 0px;
        }
        
        &.uz {
            height: 10px;
            background-position: -5307px 0px;
        }
        
        &.va {
            height: 15px;
            background-position: -5329px 0px;
        }
        
        &.vc {
            height: 14px;
            background-position: -5346px 0px;
        }
        
        &.ve {
            height: 14px;
            background-position: -5368px 0px;
        }
        
        &.vg {
            height: 10px;
            background-position: -5390px 0px;
        }
        
        &.vi {
            height: 14px;
            background-position: -5412px 0px;
        }
        
        &.vn {
            height: 14px;
            background-position: -5434px 0px;
        }
        
        &.vu {
            height: 12px;
            background-position: -5456px 0px;
        }
        
        &.wf {
            height: 14px;
            background-position: -5478px 0px;
        }
        
        &.ws {
            height: 10px;
            background-position: -5500px 0px;
        }
        
        &.xk {
            height: 15px;
            background-position: -5522px 0px;
        }
        
        &.ye {
            height: 14px;
            background-position: -5544px 0px;
        }
        
        &.yt {
            height: 14px;
            background-position: -5566px 0px;
        }
        
        &.za {
            height: 14px;
            background-position: -5588px 0px;
        }
        
        &.zm {
            height: 14px;
            background-position: -5610px 0px;
        }
        
        &.zw {
            height: 10px;
            background-position: -5632px 0px;
        }
        
        &.np {
            background-color: transparent;
        }
        
        @media (-webkit-min-device-pixel-ratio: 2),
        (min-resolution: 192dpi) {
            background-image: url("./img/country_flags@2x.png");
            background-size: 5652px 15px;
        }
    }
    
    @keyframes animation-grow {
        0% {
            width: 136px;
            height: 136px;
        }
        100% {
            width: 100vw;
            height: 100vh;
            left: 0;
            top: 0;
            padding: 15px;
        }
    }
    
    @keyframes animation-inner-grow {
        0% {
        }
        100% {
            width: calc(100vh - 30px);
            height: calc(100vh - 30px);
        }
    }
    
    .qr-portal {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;

        &.close {
            transform-origin: center;
            animation: animation-grow 0.5s linear;
            animation-fill-mode: forwards;
            background: rgba(0, 0, 0 , 0.3);
            
            .qr-portal-wrapper {
                background: transparent;
                animation: animation-inner-grow 0.5s linear;
                animation-fill-mode: forwards;
            }
        }
    }
    
    // Carousel!
    .slick-list,.slick-slider,.slick-track{position:relative;display:block}.slick-loading .slick-slide,.slick-loading .slick-track{visibility:hidden}.slick-slider{box-sizing:border-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-touch-callout:none;-khtml-user-select:none;-ms-touch-action:pan-y;touch-action:pan-y;-webkit-tap-highlight-color:transparent}.slick-list{overflow:hidden;margin:0;padding:0}.slick-list:focus{outline:0}.slick-list.dragging{cursor:pointer;cursor:hand}.slick-slider .slick-list,.slick-slider .slick-track{-webkit-transform:translate3d(0,0,0);-moz-transform:translate3d(0,0,0);-ms-transform:translate3d(0,0,0);-o-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}.slick-track{top:0;left:0}.slick-track:after,.slick-track:before{display:table;content:''}.slick-track:after{clear:both}.slick-slide{display:none;float:left;height:100%;min-height:1px}[dir=rtl] .slick-slide{float:right}.slick-slide img{display:block}.slick-slide.slick-loading img{display:none}.slick-slide.dragging img{pointer-events:none}.slick-initialized .slick-slide{display:block}.slick-vertical .slick-slide{display:block;height:auto;border:1px solid transparent}.slick-arrow.slick-hidden{display:none}
    
    .slick-dots,.slick-next,.slick-prev{position:absolute;display:block;padding:0}.slick-dots li button:before,.slick-next:before,.slick-prev:before{font-family:slick;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.slick-loading .slick-list{background:url(ajax-loader.gif) center center no-repeat #fff}@font-face{font-family:slick;font-weight:400;font-style:normal;src:url(fonts/slick.eot);src:url(fonts/slick.eot?#iefix) format('embedded-opentype'),url(fonts/slick.woff) format('woff'),url(fonts/slick.ttf) format('truetype'),url(fonts/slick.svg#slick) format('svg')}.slick-next,.slick-prev{font-size:0;line-height:0;top:50%;width:20px;height:20px;-webkit-transform:translate(0,-50%);-ms-transform:translate(0,-50%);transform:translate(0,-50%);cursor:pointer;color:transparent;border:none;outline:0;background:0 0}.slick-next:focus,.slick-next:hover,.slick-prev:focus,.slick-prev:hover{color:transparent;outline:0;background:0 0}.slick-next:focus:before,.slick-next:hover:before,.slick-prev:focus:before,.slick-prev:hover:before{opacity:1}.slick-next.slick-disabled:before,.slick-prev.slick-disabled:before{opacity:.25}.slick-next:before,.slick-prev:before{font-size:20px;line-height:1;opacity:.75;color:#fff}.slick-prev{left:-25px}[dir=rtl] .slick-prev{right:-25px;left:auto}.slick-prev:before{content:'â†'}.slick-next:before,[dir=rtl] .slick-prev:before{content:'â†’'}.slick-next{right:-25px}[dir=rtl] .slick-next{right:auto;left:-25px}[dir=rtl] .slick-next:before{content:'â†'}.slick-dotted.slick-slider{margin-bottom:30px}.slick-dots{bottom:-25px;width:100%;margin:0;list-style:none;text-align:center}.slick-dots li{position:relative;display:inline-block;width:20px;height:20px;margin:0 5px;padding:0;cursor:pointer}.slick-dots li button{font-size:0;line-height:0;display:block;width:20px;height:20px;padding:5px;cursor:pointer;color:transparent;border:0;outline:0;background:0 0}.slick-dots li button:focus,.slick-dots li button:hover{outline:0}.slick-dots li button:focus:before,.slick-dots li button:hover:before{opacity:1}.slick-dots li button:before{font-size:6px;line-height:20px;position:absolute;top:0;left:0;width:20px;height:20px;content:'â€¢';text-align:center;opacity:.25;color:#000}.slick-dots li.slick-active button:before{opacity:.75;color:#000}
`;
