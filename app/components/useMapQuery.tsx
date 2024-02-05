'use client'
import { db } from '../firebase/firebaseConfig'
import { collection, addDoc, getDocs } from "firebase/firestore"; 
import { QueryClient, useQuery, useMutation } from "@tanstack/react-query";

type Coordinate = {
    lat : number ,
    lng : number 
}

export const queryClient = new QueryClient()

const getMapHistory = async() => {
    const querySnapshot = await getDocs(collection(db, "map_history"));
    const history: Coordinate[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const lat = data.lat;
        const lng = data.lng;
        return { lat, lng };
    });
    return history;
}

export const useMapQuery = () => {
    return useQuery<Coordinate[]>({
            queryKey: ['mapHistory'], 
            queryFn: getMapHistory,
            initialData: [],
    }, queryClient)
}

export const useAddMapHistory = () => {
    return useMutation({
        mutationFn: (coord: Coordinate) => addDoc(collection(db, "map_history"), coord)
    }, queryClient)
}