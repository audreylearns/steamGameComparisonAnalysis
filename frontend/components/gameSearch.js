import { useForm } from 'react-hook-form';

export default function GameSearch(props){
    function submitForm(data) {
        console.log(data);
            fetch("http://localhost:8080/api/search?title="+ data.title).then((res) =>
            res.json().then((data) => {
                // Setting a data from api
                console.log(data)
            }))
      }
      
      const { register, handleSubmit} = useForm({
        defaultValues: {
          title: ""
        }
      });

    return (
        <>
        <p class="text-center">Enter the game title:</p>
        <form class="text-center" onSubmit={handleSubmit(submitForm)}>
            <input class="text-center border text-center border-4 border-black" {...register("title")} /><br /><br />
            <button type="submit">search</button>
        </form>
        </>
    )
}