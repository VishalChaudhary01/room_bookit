import { Rooms } from "@/components/Rooms";
import { SearchBar } from "@/components/SearchBar";
import { Suspense } from "react";
import { Loader } from "@/components/Loader";

export default function RoomsPage({ searchParams }: { searchParams?: SearchParamsType }) {
    
    return (
        <div className="flex flex-col gap-4">
            <SearchBar searchParams={searchParams} />
            <Suspense fallback={ <Loader /> }>
                <Rooms searchParams={searchParams} />
            </Suspense>
        </div>
    );
}