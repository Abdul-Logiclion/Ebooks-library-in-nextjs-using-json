'use client'
import { Suspense } from 'react';
import BookEditor from "../components/BookEditor";

export default function AddBookPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BookEditor />
        </Suspense>
    );
}