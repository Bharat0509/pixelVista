"use client";
import { deleteProject, fetchToken } from "@/lib/action";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
type Props = {
    projectId: string;
};
const ProjectActions = ({ projectId }: Props) => {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const handleDeleteProject = async () => {
        setIsDeleting(true);
        const { token } = await fetchToken();
        try {
            await deleteProject(projectId, token);
            router.push("/");
        } catch (error) {
            console.log(error, "PROJECT_ACTION_DELETE_PROJECT_ERROR");
        } finally {
            setIsDeleting(false);
        }
    };
    return (
        <>
            <Link
                href={`/edit-project/${projectId}`}
                className='flexCenter edit-action_btn'
            >
                <Image src='/pencile.svg' width={16} height={16} alt='Edit' />
                <span className='sr-only hidden'>Edit</span>
            </Link>
            <button
                type='button'
                onClick={handleDeleteProject}
                className={`flexCenter transition delete-action_btn 
                ${isDeleting ? "bg-gray" : "bg-primary-purple"}`}
            >
                <Image src='/trash.svg' width={16} height={16} alt='Edit' />
                <span className='sr-only hidden'>Delete</span>
            </button>
        </>
    );
};

export default ProjectActions;
