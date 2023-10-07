import {ForElements} from "./Functions";

export function getLatinLetter(no){
    let str = (no).toString(26),
        str2 = '';
    str.split('').forEach((e, i) => {
        let code = e.charCodeAt(0) + (isNaN(Number(e)) ? 10 - 33 : 16) + ((i === 0) ? 0 : 1);
        str2 += String.fromCharCode(code);
    })
    return str2;
}
export function getChineseLetter(no){
    let chin = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九']
    let chin2 = ['', '十', '百', '千', '萬', '十', '百', '千', '億', '十']


    let str = '';
    let i = 0;
    while (no >= 1) {
        let temp = chin[no % 10];
        str = ((temp === '') ?
                ((str === '' || str[0] === '萬' || str[0] === '億')? '' : '〇') :
                chin2[i])
            + str;
        str = ((str[0] === '十' && temp === '一') ? '' : temp) + str;

        no = parseInt(no / 10);

        i++
    }
    return str
}

export function GridNumbers({width, height, rowNoType, columnNoType}){
    function getNoDivs(length, type) {
        return ForElements(length, (i) =>
            <div key={i}>
                {
                    (type === "latin")?
                        getLatinLetter(i+1) :
                        (type === "chinese")?
                            getChineseLetter(i+1) :
                            (i+1)
                }
            </div>
        )
    }
    return(
        <>
            <div className="row-no">
                {getNoDivs(width, rowNoType)}
            </div>
            <div className="column-no">
                {getNoDivs(height, columnNoType)}
            </div>
        </>
    )


}


