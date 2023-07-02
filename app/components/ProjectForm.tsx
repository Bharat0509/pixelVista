"use client";
import { ProjectInterface, SessionInterface } from "@/typing";
import Image from "next/image";
import React, { ChangeEvent, useState } from "react";
import FormField from "./FormField";
import { categoryFilters } from "@/constants";
import CustomMenu from "./CustomMenu";
import Button from "./Button";
import { createNewProject, fetchToken, updateProject } from "@/lib/action";
import { useRouter } from "next/navigation";

type Props = {
    type: string;
    session: SessionInterface;
    project?: ProjectInterface;
};

const ProjectForm = ({ type, session, project }: Props) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        title: project?.title || "",
        description: project?.description || "",
        liveSiteUrl: project?.liveSiteUrl || "",
        githubUrl: project?.githubUrl || "",
        category: project?.category || "",
        image: project?.image || "",
    });

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const token = await fetchToken();
        try {
            if (type === "create") {
                await createNewProject(form, session?.user?.id, token);

                router.push("/");
            }
            if (type === "edit") {
                await updateProject(form, project?.id as string, token);
                router.push("/");
            }
        } catch (error) {
            console.log("Create Project ERROR");
            console.log(error);

            // throw error;
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const file = e.target?.files?.[0];
        if (!file) return;
        if (!file.type.includes("image")) {
            return alert("Please upload an image file!");
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
            const result = reader.result as string;
            handleStateChange("image", result);
        };
    };

    const handleStateChange = (fieldName: string, value: string) => {
        setForm((prevState) => ({ ...prevState, [fieldName]: value }));
    };

    return (
        <form onSubmit={handleFormSubmit} className='flexStart form'>
            <div className='flexStart form_image-container'>
                <label htmlFor='poster' className='flexCenter form_image-label'>
                    {!form.image && "Choose a Poster for your Project"}
                </label>
                <input
                    type='file'
                    id='image'
                    accept='image/*'
                    required={type === "create"}
                    className='form_image-input'
                    onChange={handleChangeImage}
                />
                {form.image && (
                    <Image
                        src={form?.image}
                        className='sm:p-10 object-contain z-20'
                        alt='Project Poster'
                        fill
                    />
                )}
            </div>
            <FormField
                title='Title'
                state={form.title}
                placeholder='Flexibble'
                setState={(value: string) => handleStateChange("title", value)}
            />
            <FormField
                title='Description'
                isTextArea
                state={form.description}
                placeholder='Showcase and Discover remarkable projects from developers across the word.'
                setState={(value: string) =>
                    handleStateChange("description", value)
                }
            />
            <FormField
                type='url'
                title='Project Live URL'
                state={form.liveSiteUrl}
                placeholder='https://pixelVista.vercel.app'
                setState={(value: string) =>
                    handleStateChange("liveSiteUrl", value)
                }
            />
            <FormField
                type='url'
                title='Github URL'
                state={form.githubUrl}
                placeholder='https://github.com/bharat0509'
                setState={(value: string) =>
                    handleStateChange("githubUrl", value)
                }
            />

            <CustomMenu
                title='Category'
                state={form.category}
                filters={categoryFilters}
                setState={(value: string) =>
                    handleStateChange("category", value)
                }
            />
            <div className='flexStart w-full'>
                <Button
                    title={
                        isSubmitting
                            ? `${type === "create" ? "Creating" : "Editing"}`
                            : `${type === "create" ? "Create" : "Edit"}`
                    }
                    type='submit'
                    LeftIcon={isSubmitting ? "" : "/plus.svg"}
                    isSubmitting={isSubmitting}
                />
            </div>
        </form>
    );
};

export default ProjectForm;
