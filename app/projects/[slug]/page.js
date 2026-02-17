import { notFound } from 'next/navigation';
import { getProjectBySlug, getAllSlugs } from '@/lib/projects';
import ProjectDetailClient from './ProjectDetailClient';

export async function generateStaticParams() {
    return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const project = getProjectBySlug(slug);
    if (!project) return {};
    return {
        title: project.seoTitle,
        description: project.seoDescription,
        openGraph: {
            title: project.seoTitle,
            description: project.ogDescription,
        },
    };
}

export default async function ProjectPage({ params }) {
    const { slug } = await params;
    const project = getProjectBySlug(slug);
    if (!project) notFound();

    return <ProjectDetailClient project={project} />;
}
