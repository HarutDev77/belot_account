import styles from "../css/bazarblot.module.css"
import {useState,useEffect} from "react";

const BazarBlot = () => {

    const [value, setValue] = useState({
        valueFirst: "",
        valueSecond: "",
        valueScore: "",
    });

    const [text,setText] = useState('');
    const [account, setAccount] = useState([]);
    const [objButton,setObjButton] = useState({
        showKaput: false,
        showQris: false,
        showSur: false
    })

    const handleChange = (e,name) => {

        const pattern = /^[0-9]+$/;
        const isValid = pattern.test(e.target.value);

        if(isValid){
            setValue({
                ...value,
                [name]: e.target.value,
            });
        }

        if(e.target.value === ''){
            setValue({
                ...value,
                [name]: '',
            });
        }
    }

    const handleBlur = (e) =>{
        if(value.valueFirst !== "" && value.valueSecond !== "" && value.valueScore !== ""){

            setAccount([...account, value]);
            setText(value.valueScore)
            setValue({
                valueFirst: "",
                valueSecond: "",
                valueScore: "",
            });

            localStorage.setItem("account", JSON.stringify([...account,{...value,valueScore: text}]));
            localStorage.setItem("text", text);
        }

        if(e.target.name === "changedValueFirst" || e.target.name === "changedValueSecond" || e.target.name === "changedValueScore"){

            const keys = [];
            const accountsLastObject = account[account.length-1];

            if(e.target.value && accountsLastObject['valueFirst'] && accountsLastObject['valueSecond']  && accountsLastObject['valueScore'] ){
                e.target.name === "changedValueFirst" && keys.push('valueSecond', 'valueScore');
                e.target.name === "changedValueSecond" && keys.push('valueFirst', 'valueScore');
                e.target.name === "changedValueScore" && keys.push('valueFirst', 'valueSecond');

                const newObject = {
                    [e.target.id]: e.target.value,
                    [keys[0]]: accountsLastObject[keys[0]],
                    [keys[1]]: accountsLastObject[keys[1]]
                }

                const newAccounts = [...account];

                newAccounts.pop();
                newAccounts.push(newObject);
                setAccount([...newAccounts]);
                setText(newObject.valueScore)

                localStorage.setItem("account", JSON.stringify(newAccounts));
                localStorage.setItem("text", newObject.valueScore);
            }
        }
    }

    const removeAll = () =>{
        localStorage.removeItem('account')
        setAccount([])
        setText('')
        setValue({
            valueFirst: "",
            valueSecond: "",
            valueScore: "",
        })
    }

    const handleClick = (e) => {

        if (!account.length){
            return;
        }

        const id = e.target.id
        const changedButton = {
            ...objButton,
            [id]: !objButton[id]
        };

        setObjButton(changedButton);

        const keys = {
            showKaput: 'K',
            showQris: 'Q',
            showSur: 'S'
        };

        let resultTxt = '';

        for (let item in changedButton){
            if (changedButton[item]){

                resultTxt += keys[item];

                const changedScore = parseInt(account[account.length - 1].valueScore) + resultTxt;
                const newObject = {...account[account.length - 1], valueScore: changedScore}

                const newAccounts2 = [...account];

                newAccounts2.pop();
                newAccounts2.push(newObject);

                setAccount([...newAccounts2]);
                setText(newObject.valueScore)
                localStorage.setItem("account", JSON.stringify(newAccounts2));
                localStorage.setItem("text", newObject.valueScore);
            }

            if (!changedButton["showKaput"] && !changedButton["showQris"] && !changedButton["showSur"]){
                const changedScore = parseInt(account[account.length - 1].valueScore);
                const newObject = {...account[account.length - 1], valueScore: changedScore}

                const newAccounts2 = [...account];

                newAccounts2.pop();
                newAccounts2.push(newObject);

                setAccount([...newAccounts2]);
                setText(newObject.valueScore)
                localStorage.setItem("account", JSON.stringify(newAccounts2));
                localStorage.setItem("text", newObject.valueScore);
            }
         }
    }

    useEffect(()=>{

        const account1 = localStorage.getItem('account')
        const text = localStorage.getItem('text')
        const newAccount = JSON.parse(account1)

        if(newAccount){
            setAccount([
                ...newAccount
            ])
        }

        if (text){
            setText(text)
        }

    },[])

    let div = account.map((val,i)=>{

        return (i === account.length-1 ?
                <div className={styles.contAccount} key={i}>
                    <input className={styles.contAccountInput} name="changedValueFirst" id="valueFirst" onBlur={e=>handleBlur(e)}  type='text'
                           defaultValue={val.valueFirst}/>
                    <input className={styles.contAccountInput} name="changedValueSecond" id="valueSecond" onBlur={e=>handleBlur(e)}  type='text'
                           defaultValue={val.valueSecond}/>
                    <input className={styles.contAccountInputScore} name="changedValueScore" id="valueScore" onChange={(e)=>{
                        const pattern = /^[0-9]+$/;
                        const isValid = pattern.test(e.target.value);

                        if (e.target.value && !isValid){
                            return;
                        }

                        setText(e.target.value)
                    }} onBlur={e=>handleBlur(e)}  type='text'
                           value={text}/>
                    {/*<span id="valueScore" className={styles.contAccountSpanScore}>{val.valueScore}</span>*/}
                </div>
                :<div className={styles.contAccount} key={i}>
                    <div>{val.valueFirst}</div>
                    <div>{val.valueSecond}</div>
                    <div>{val.valueScore}</div>
                </div>
        )
    })

    let score1 = account.reduce((firstVal,val)=>{

        return Number(firstVal) + Number(val.valueFirst);
    },0)

    let score2 = account.reduce((secondVal,val)=>{

        return Number(secondVal) + Number(val.valueSecond);
    },0)

     return (
        <>
            <div className={styles.contDiv}>
                <div className={styles.contHeader}>
                    <h2>Մենք</h2>
                    <h2>Դուք</h2>
                    <h2>ՈՒզած</h2>
                </div>
                <div className={styles.contInput}>
                    <input maxLength="3" onBlur={handleBlur} autoComplete="off" value={value.valueFirst} name="valueFirst"  onChange={(e)=>handleChange(e,e.target.name)} type="text"/>
                    <input maxLength="3" onBlur={handleBlur} autoComplete="off" value={value.valueSecond} name="valueSecond" onChange={(e)=>handleChange(e,e.target.name)} type="text"/>
                    <input maxLength="5" onBlur={handleBlur} autoComplete="off" value={value.valueScore} name="valueScore" onChange={(e)=>handleChange(e,e.target.name)} type="text"/>
                </div>
                <div className={styles.content}>
                    <div>
                        {div}
                        <div className={styles.contScore}>
                            <div>{score1}</div>
                            <div>{score2}</div>
                        </div>
                    </div>
                </div>
                <div className={styles.contFooter}>
                    <img onClick={removeAll} alt="bin" className={styles.recycleBin} src="/images/icons8-recycle-bin-64.png" />
                    <button type='button' id='showKaput' className = {objButton.showKaput ? styles.red : styles.buttons} onClick={(e)=>handleClick(e)} >K</button>
                    <button type='button' id='showQris' className = {objButton.showQris ? styles.red : styles.buttons} onClick={(e)=>handleClick(e)} >Q</button>
                    <button type='button' id='showSur' className = {objButton.showSur ? styles.red : styles.buttons} onClick={(e)=>handleClick(e)} >S</button>
                </div>

            </div>
        </>
    )
}

 export default BazarBlot