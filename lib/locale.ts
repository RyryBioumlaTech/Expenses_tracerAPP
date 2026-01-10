export function getUserLang(){
    if(typeof window === undefined){
        return "en-US"
    }
    return navigator.language
}

export function getUserTimeZone(){
    if(typeof window === undefined){
        return "UTC"
    }
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}