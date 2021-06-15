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

    //Use State
    let defaultValue: Animal = {
        id: 0,
        name: "", 
        latinName: "", 
        yearOfBirth: 0,
        shortDescription: "", 
        longDescription: "", 
        imageUrl: "", 
        isFed: false, 
        lastFed: 0 
    } 
    const [animal, setAnimal] = useState(defaultValue)

    useEffect(() => { 
        const animalsFromLS = localStorage.getItem('animals')
        if (animalsFromLS) {
            const storedAnimals = JSON.parse(animalsFromLS)
            const anAnimal = storedAnimals.filter((ani: Animal) => ani.id === Number(id))[0]
            setAnimal(anAnimal)
        } else {
            axios.get<Animal[]>('https://animals.azurewebsites.net/api/animals')
                .then((response) => {
                    const animalsApi = response.data
                    const oneAnimal = animalsApi.filter((ani: Animal) => ani.id === Number(id))[0]
                    setAnimal(oneAnimal) 
                    localStorage.setItem('animals', JSON.stringify(animalsApi))
            })
        }
    }, [id])

    function feedClick (animalId: number) {
        //Update state
        const updatedAnimal = {...animal, isFed: true}
        setAnimal(updatedAnimal)

        //Update localStorage
        const animalsFromLS = localStorage.getItem('animals')
        if (animalsFromLS) {
            const storedAnimals = JSON.parse(animalsFromLS)
            
            const idAnimal = storedAnimals.map( (ani: Animal) => {
                if(ani.id === animalId){
                    return {...ani, isFed: true}
                } else {
                    return ani
                }
            })
            localStorage.setItem('animals', JSON.stringify(idAnimal))
        }
    }
    
    //HTML
    return (
        <div className = "animal-detail-container">
            <img className ="detail-img" src={animal.imageUrl} alt=""  /> 

            <div className="status">
                <h3>{animal.name}</h3>
                {animal.isFed ? 
                    <div className="tooltip">
                        <img className="happy-icon" src="/happy.png" alt="" /><span className = "tooltip-time">Last Fed: {animal.lastFed}</span>
                    </div> : 
                    <div className="tooltip">
                        <img className="sad-icon" src="/sad.png" alt="" /><span className = "tooltip-time">Last Fed: {animal.lastFed}</span>
                    </div>
                }
                <button onClick = { () => {feedClick(animal.id)} }>Feed Me</button>
            </div>

            <b>{animal.latinName}</b>
            <p>{animal.shortDescription}</p>
            <p>{animal.longDescription}</p>
        </div>
    )
}