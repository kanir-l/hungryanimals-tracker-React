import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Animal } from '../models/Animal';

//Interface for id in the params
interface IParamId {
    id: string
}

export const AnAnimal = () => {
    let { id } = useParams<IParamId>() 

    let defaultValue: Animal = {
        id: 0,
        name: "", 
        latinName: "", 
        yearOfBirth: 0,
        shortDescription: "", 
        longDescription: "", 
        imageUrl: "", 
        isFed: false, 
        lastFed: new Date()
    } 
    const [animal, setAnimal] = useState(defaultValue)

    /* const [currentTime, setCurrentTime] = useState(Number(new Date()))
  
    useEffect(() => {
        setInterval(()=>{
            setCurrentTime(Number(new Date()))
        }, 3000)
    }, [])  */

    useEffect(() => { 
        const animalsFromLS = localStorage.getItem('animals')
        if (animalsFromLS) {
            const storedAnimals = JSON.parse(animalsFromLS)
            const oneAnimalLS = storedAnimals.filter((ani: Animal) => ani.id === Number(id))[0]
            setAnimal(oneAnimalLS)
        } else {
            axios.get<Animal[]>('https://animals.azurewebsites.net/api/animals')
                .then((response) => {
                    const animalsApi = response.data
                    const oneAnimalApi = animalsApi.filter((ani: Animal) => ani.id === Number(id))[0]
                    setAnimal(oneAnimalApi) 
                    localStorage.setItem('animals', JSON.stringify(oneAnimalApi))
            })
        }
    }, [id])

    useEffect(() => {
        const currentTime = Number(new Date())
        const feedTime = Number(new Date(animal.lastFed))
        const checkedTime  = currentTime - feedTime
        const threeHrs = 10800000
    
        //Update state
        if (animal.isFed && checkedTime >= threeHrs) {
            const statusResetAnimal = {...animal, isFed: false}
            setAnimal(statusResetAnimal)
         
            //Then the localStorage
            const animalsFromLS = localStorage.getItem('animals')
            if (animalsFromLS) {
                const storedAnimals = JSON.parse(animalsFromLS)
                const updatedStatusAnimal = storedAnimals.map( (ani: Animal) => {
                    if(ani.id === animal.id){
                        return {...ani, isFed: false}
                    } else {
                        return ani
                    }
                })
                localStorage.setItem('animals', JSON.stringify(updatedStatusAnimal))
            }   
        } 
    }, [animal])   

    function feedClick (animalId: number) {
        //Update state
        const fedAnimal = {...animal, isFed: true, lastFed: new Date()}
        setAnimal(fedAnimal)

        //Then the localStorage
        const animalsFromLS = localStorage.getItem('animals')
        if (animalsFromLS) {
            const storedAnimals = JSON.parse(animalsFromLS)
            const updatedFedAnimal = storedAnimals.map( (ani: Animal) => {
                if(ani.id === animalId){
                    return {...ani, isFed: true, lastFed: new Date()}
                } else {
                    return ani
                }
            })
            localStorage.setItem('animals', JSON.stringify(updatedFedAnimal))
        }   
    }
 
    //For viewing the feed time in HTML
    const feedTime = (new Date(animal.lastFed)).toLocaleString()
    
    return (
        <div className = "animal-detail-container">
            <img className ="detail-img" src={animal.imageUrl} alt=""  /> 
            <div className="status">
                <h3>{animal.name}</h3>
                {animal.isFed ?
                    <div className="tooltip">
                        <img className="happy-icon" src="/happy.png" alt="" />
                        <span className = "tooltip-time">Last Fed: {feedTime}</span>
                    </div> : 
                    <div className="tooltip">
                        <img className="sad-icon" src="/sad.png" alt="" />
                        <span className = "tooltip-time">Last Fed: {feedTime}</span>
                    </div>
                }
                <button disabled={animal.isFed} onClick = {() => {feedClick(animal.id)}}>Feed Me</button>
            </div>
            <b>{animal.latinName}</b>
            <p>{animal.shortDescription}</p>
            <p>{animal.longDescription}</p>
        </div>
    )
}