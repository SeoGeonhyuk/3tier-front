
    import React from 'react';
    import architecture from '../../assets/3TierArch.png'

    function Home() {
        const version = require('../../../package.json').version;
        const instanceIp = window.location.hostname;

        return (
            <div>
            <h1 style={{color:"white"}}>AWS 3-TIER WEB APP DEMO</h1>
            <p style={{color:"#aaa", fontSize:"14px"}}>Frontend Version: {version}</p>
            <p style={{color:"#aaa", fontSize:"14px"}}>Instance IP: {instanceIp}</p>
            <img src={architecture} alt="3T Web App Architecture" style={{height:400,width:825}} />
          </div>
        );
    }

    export default Home;