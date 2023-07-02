import React from "react";
import Modal from "../../components/Modal";
import ProjectForm from "../../components/ProjectForm";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { getProjectDetails } from "@/lib/action";
import { ProjectInterface } from "@/typing";

type Props = {
    params: {
        id: string;
    };
};

const EditProject = async ({ params: { id } }: Props) => {
    try {
        const session = await getCurrentUser();
        if (!session?.user) redirect("/");
        const res = (await getProjectDetails(id)) as {
            project?: ProjectInterface;
        };
        return (
            <Modal>
                <h3 className='modal-head-text'>Edit Project</h3>
                <ProjectForm
                    type='edit'
                    session={session}
                    project={res?.project}
                />
            </Modal>
        );
    } catch (error) {
        return null;
    }
};

export default EditProject;
