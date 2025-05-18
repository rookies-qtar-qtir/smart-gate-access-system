import React from "react";
import { FireFilled } from "@ant-design/icons";

const Logo = () => {
    return (    
        <div className="logo flex items-center">
            <div className="logo-icon">
                <img
                    src="./assets/react.svg"
                    alt="Logo"
                    className="h-10 w-10 mr-2"
                />
            </div>
        </div>
    )
}
export default Logo;