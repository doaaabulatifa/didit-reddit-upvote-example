import auth from "../../app/middleware";
import { db } from "@/db";
import { LoginButton } from "./LoginButton";
import { LogoutButton } from "./LogoutButton";

export default function MyProfilePage({ user, error }) {
    if (error) {
        return <div>Error: {error}</div>;
    }

    async function editProfile(formData) {
        "use server";
        const name = formData.get("name");
        const email = formData.get("email");
        const image = formData.get("image");

        await db.query(
            "UPDATE users SET name = $1, email = $2, image = $3 WHERE id = $4",
            [name, email, image, user.id]
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
                    placeholder="Your Name"
                    defaultValue={user.name}
                />
                <input
                    name="email"
                    placeholder="Your Email"
                    defaultValue={user.email}
                />
                <input
                    name="image"
                    placeholder="Your Image"
                    defaultValue={user.image}
                />
                <button>Submit Changes</button>
            </form>
        </div>
    );
}

export async function getServerSideProps(context) {
    try {
        const session = await auth(context.req, context.res);
        if (!session || !session.user) {
            throw new Error("User not authenticated");
        }

        const userId = session.user.id;
        const result = await db.query("SELECT * FROM users WHERE id = $1", [userId]);

        const user = result.rows[0];
        if (!user) {
            throw new Error("User not found");
        }

        return {
            props: { user }, // will be passed to the page component as props
        };
    } catch (error) {
        console.error(error);
        return {
            props: { error: error.message },
        };
    }
}

