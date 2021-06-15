import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Animal } from '../models/Animal';


export const Animals = () => {
    //Use State
    let defaultValue: Animal[] = []
    const [animals, setAnimals] = useState(defaultValue)

    useEffect(() => {
        const animalsFromLS = localStorage.getItem('animals')
        if (animalsFromLS) {
            const storedAnimals = JSON.parse(animalsFromLS)
            setAnimals(storedAnimals)
        } else {
            axios.get<Animal[]>('https://animals.azurewebsites.net/api/animals')
                .then((response) => {
                    const animalsApi = response.data
                    setAnimals(animalsApi) 
                    localStorage.setItem('animals', JSON.stringify(animalsApi))
            })
        }
    }, [])

    //HTML
    let liTags = animals.map((animal) => {
        return (<li key={animal.id}>
            <div className = "animal-container">
                <Link to={"/AnAnimal/" + animal.id }>
                    <img src={animal.imageUrl} alt=""  /> 
                </Link>
                    <h3>{animal.name}</h3>
                    <p>{animal.shortDescription}</p>
                    <b>{animal.isFed ? <div><img className="happy-icon" src="/happy.png" alt="" /><b>Mätt, Tack</b></div> : <div><img className="sad-icon" src="/sad.png" alt="" /><b>Hungrig!</b></div> }</b>
            </div>
        </li>)
    })
    return (<div>{liTags}</div>)
}