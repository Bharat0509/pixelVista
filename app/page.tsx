import { fetchAllProjects } from "@/lib/action";
import "./globals.css";
import { ProjectInterface } from "@/typing";
import ProjectCard from "./components/ProjectCard";
import Categories from "./components/Categories";
import LoadMore from "./components/LoadMore";
type Props = {
    searchParams: {
        category?: string;
        endcursor?: string;
    };
};
type ProjectSearch = {
    projectSearch: {
        edges: {
            node: ProjectInterface;
        }[];
        pageInfo: {
            hasPreviousPage: boolean;
            hasNextPage: boolean;
            startCursor: string;
            endCursor: string;
        };
    };
};

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;
const Home = async ({ searchParams: { category, endcursor } }: Props) => {
    const data = (await fetchAllProjects(category, endcursor)) as ProjectSearch;

    const projectsToDisplay = data?.projectSearch?.edges || [];
    if (projectsToDisplay.length === 0) {
        return (
            <section className='flexStart flex-col paddings'>
                <Categories />
                <p className='no-result-text text-center'>
                    No projects found , try creating one...
                </p>
            </section>
        );
    }
    const pagination = data?.projectSearch?.pageInfo;

    return (
        <section className='flex-start flex-col paddings mb-16'>
            <Categories />
            <section className='projects-grid'>
                {projectsToDisplay.map(
                    ({ node }: { node: ProjectInterface }) => (
                        <ProjectCard
                            id={node.id}
                            key={node.id}
                            image={node.image}
                            title={node.title}
                            name={node.createdBy?.name}
                            avatarUrl={node.createdBy?.avatarUrl}
                            userId={node.createdBy?.id}
                        />
                    )
                )}
            </section>
            <LoadMore
                startCursor={pagination.startCursor}
                endCursor={pagination.endCursor}
                hasPreviousPage={pagination.hasPreviousPage}
                hasNextPage={pagination.hasNextPage}
            />
        </section>
    );
};

export default Home;
