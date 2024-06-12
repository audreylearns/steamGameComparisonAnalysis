import Image from "next/image";
import { Inter } from "next/font/google";
import React, { useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  const [data, setdata] = useState({
    appid: "",
    name: "",
    logo: ""
  });

  useEffect(() => {
    // Using fetch to fetch the api from 
    // flask server it will be redirected to proxy
    fetch("http://localhost:8080/api/search?title=sims%204").then((res) =>
        res.json().then((data) => {
            // Setting a data from api
            console.log(data)
            setdata({
                appid: data[0].appid,
                name: data[0].name,
                logo: data[0].logo,
            });
        })
    );
  }, []);


  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}>
        <header className="App-header">
            <h1>React and flask</h1>
            {/* Calling a data from setdata for showing */}
            <p>{data.name}</p>
            <p>{data.appid}</p>
            <p>{data.logo}</p>
        </header>


    </main>
  );
}

