'use client';
import { useEffect } from "react";

export default function Linkedin () {

    useEffect(() => {
        const script = document.createElement('script');
        script.src="https://platform.linkedin.com/badges/js/profile.js";
        script.async = true;
        script.defer = true;
        script.type = "text/javascript";

        document.body.appendChild(script)

        return () => {
            document.body.removeChild(script)
        };
    },[])


    return (
        <div
            className="badge-base LI-profile-badge" 
            data-locale="en_US" 
            data-size="large" 
            data-theme="light" 
            data-type="HORIZONTAL" 
            data-vanity="cc-peter-fan" 
            data-version="v1">
            <a 
                className="badge-base__link LI-simple-link" 
                href="https://ca.linkedin.com/in/cc-peter-fan?trk=profile-badge">
                Peter Fan
            </a>
        </div>
    )
}