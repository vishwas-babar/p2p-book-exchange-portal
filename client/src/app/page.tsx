import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {


  redirect("/home");

  return (
    <>
      <div>
        this is the home page!
      </div>
    </> 
  );
}
