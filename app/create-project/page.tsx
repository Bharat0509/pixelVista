import React from "react";
import Modal from "../components/Modal";
import ProjectForm from "../components/ProjectForm";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

type Props = {};

const CreateProject = async ({}: Props) => {
    try {
        const session = await getCurrentUser();
        if (!session?.user) redirect("/");
        return (
            <Modal>
                <h3 className='modal-head-text'>Create a New Project</h3>
                <ProjectForm type='create' session={session} />
            </Modal>
        );
    } catch (error) {
        return null;
    }
};

export default CreateProject;
