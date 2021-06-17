import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Animal } from '../models/Animal';


export const Animals = () => {
    let defaultValue: Animal[] = []
    const [animals, setAnimals] = useState(defaultValue)

    /* const [currentTime, setCurrentTime] = useState(Number(new Date()))
  
    useEffect(() => {
        setInterval(()=>{
            setCurrentTime(Number(new Date()))
        }, 3000)
    }, [])  */

    useEffect(() => {
        const threeHrs = 10800000

        const animalsFromLS = localStorage.getItem('animals')
        if (animalsFromLS) {
            const storedAnimals = JSON.parse(animalsFromLS).map((animal: Animal) => {
                return {...animal, lastFed: new Date(animal.lastFed)}
            })
            //setAnimals(storedAnimals)
            const statusAnimals = storedAnimals.map((animal: Animal) => {
                const currentTime = Number(new Date())
                const feedTime = Number(new Date(animal.lastFed))
                const checkedTime  = currentTime - feedTime
                if (animal.isFed && checkedTime >= threeHrs) {
                    const statusResetAnimal = {...animal, isFed: false}
                    return statusResetAnimal
                } else {
                    return animal
                }
            })
            setAnimals(statusAnimals)
        } else {
            axios.get<Animal[]>('https://animals.azurewebsites.net/api/animals')
                .then((response) => {
                    const animalsApi = response.data
                    //setAnimals(animalsApi)
                    const statusAnimals = animalsApi.map((animal: Animal) => {
                        const currentTime = Number(new Date())
                        const feedTime = Number(new Date(animal.lastFed))
                        const checkedTime  = currentTime - feedTime
                        if (animal.isFed && checkedTime >= threeHrs) {
                            const statusResetAnimal = {...animal, isFed: false}
                            return statusResetAnimal
                        } else {
                            return animal
                        }
                    })
                    setAnimals(statusAnimals)
                    localStorage.setItem('animals', JSON.stringify(statusAnimals))
            })
        }
    }, [])

     //HTML MAP
    const currentTime = Number(new Date())

    let liTags = animals.map((animal) => {
        return (<li key={animal.id}>
            <div className = "animal-container">
                <Link to={"/AnAnimal/" + animal.id }>
                    <img src={animal.imageUrl} alt=""  /> 
                </Link>
                <h3>{animal.name}</h3>
                <p>{animal.shortDescription}</p>
                {currentTime - Number(animal.lastFed) > 14400000 ? 
                    <img className="warming-icon" src="/warning.svg" alt="" /> : 
                    <img className="warming-icon-hidden" src="/warning.svg" alt="" />
                }
                <b>{animal.isFed ? 
                    <div>
                        <img className="happy-icon" src="/happy.png" alt="" />
                        <b>Mätt, Tack</b>
                    </div> : 
                    <div>
                        <img className="sad-icon" src="/sad.png" alt="" />
                        <b>Hungrig!</b>
                    </div> 
                }</b> 
            </div>
        </li>)
    })

    return (<div>{liTags}</div>)
}