'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Breadcrumb from '../post-component/layouts/Breadcrumb';
import { Author } from '../post-component/type/author';

export default function AuthorPage() {
	const params = useParams();
	const authorId = params?.id;

	const [author, setAuthor] = useState<Author | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// 防呆：ID 還沒抓到前先不發請求
		if (!authorId) return;

		async function fetchAuthor() {
			try {
				const res = await fetch(`/api/authors/${authorId}`);
				if (!res.ok) {
					setAuthor(null);
				} else {
					const data = await res.json();
					setAuthor(data);
				}
			} catch (error) {
				console.error('獲取作者失敗', error);
				setAuthor(null);
			} finally {
				setLoading(false);
			}
		}

		fetchAuthor();
	}, [authorId]);

	if (loading) {
		return <div className="container mx-auto p-4">載入中...</div>;
	}

	if (!author) {
		return <div className="container mx-auto p-4">作者不存在</div>;
	}

	return (
		<div className="container mx-auto p-4">
			<Breadcrumb
				paths={[
					{ name: '首頁', href: '/' },
					{ name: '文章專區', href: '/article' },
					{ name: '作者介紹', href: '/post-author' },
				]}
			/>

			<h1 className="text-3xl font-bold mt-4">{author.name}</h1>
			<p className="mt-2 text-gray-700">{author.bio}</p>

			<h2 className="text-2xl font-semibold mt-6">投稿文章</h2>
			{/* 渲染文章列表邏輯 */}
		</div>
	);
}
