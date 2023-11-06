import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';


const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
        backgroundColor: '#1b263b',
        width: '4px', 
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
};

function Layout({ children }) {
    return (
        <Scrollbars 
            style={{ width: '100vw', height: '100vh', scrollBehavior: 'smooth' }}
            renderThumbVertical={renderThumb}
            autoHide
            // Hide delay in ms
            autoHideTimeout={200}
            // Duration for hide animation in ms.
            autoHideDuration={200}
        >
            {children}
        </Scrollbars>
    );
}

export default Layout;
