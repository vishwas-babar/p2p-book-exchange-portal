import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {


  redirect("/books");

  return (
    <>
      <div>
        this is the home page!
      </div>
    </> 
  );
}
