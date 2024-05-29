import auth from "../../app/middleware";
import { db } from "@/db";
// import { LoginButton } from "./LoginButton";
// import { LogoutButton } from "./LogoutButton";

export default async function myProfile() {
    const { userId } =  await auth();
    console.log({userId});
    const result = await db.query("SELECT * FROM userss WHERE id = $1", [userId]);
 
  
  const user = result.rows[0]; 

  async function editProfile(formData) {
    "use server";
    const name = formData.get("name");
    const email= formData.get("email");
    const image= formData.get("image");
  
    await db.query(
        "UPDATE users SET name = $1, email = $2,image= $3 WHERE id = $4",
        [name, email, image, userId]
      );
    // revalidatePath("/");
  
    // redirect("/");
  }

  return (
    <div>
      <form action={editProfile}>
        <label>Name</label>
        <input
          name="name"
          placeholder="your Name"
          defaultValue={user.name}
        />
        <input
          name="email"
          placeholder="your email"
          defaultValue={user.email}
         
        />
        <input
          name="image"
          placeholder="your image"
          defaultValue={user.image}
        />
   

       
        <button>Submit Changes</button>
      </form>
    </div>
  );
}