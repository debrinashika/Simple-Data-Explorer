"use client";

import { SetStateAction, useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown, ArrowUp, ArrowDown, Search, X } from "lucide-react";

type User = {
  id: number;
  username: string;
  name: string;
  email: string;
  age: number;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [ageFilter, setAgeFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<keyof User>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: pageSize.toString(),
          search: search || "",
          sort_by: sortKey,
          order: sortOrder,
        });

        if (ageFilter !== "all") {
          params.append("age", ageFilter);
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/api/users?${params}`);

        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        
        const data = await res.json();
        setUsers(data.data);
        setTotalPages(data.total_pages);
        setTotal(data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, ageFilter, sortKey, sortOrder, page]);

  const handleSort = (key: keyof User) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const getSortIcon = (key: keyof User) => {
    if (sortKey !== key) {
      return <ArrowUpDown className="w-4 h-4 ml-1 opacity-30" />;
    }
    return sortOrder === "asc" 
      ? <ArrowUp className="w-4 h-4 ml-1" />
      : <ArrowDown className="w-4 h-4 ml-1" />;
  };

  const clearFilters = () => {
    setSearch("");
    setAgeFilter("all");
    setSortKey("id");
    setSortOrder("asc");
    setPage(1);
  };

  const hasActiveFilters = search !== "" || ageFilter !== "all" || sortKey !== "id" || sortOrder !== "asc";

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-sm text-muted-foreground">
          {total} total records
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <div className="relative md:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e: { target: { value: SetStateAction<string>; }; }) => { 
              setSearch(e.target.value); 
              setPage(1); 
            }}
            className="pl-9"
          />
        </div>

        <Select 
          value={ageFilter} 
          onValueChange={(value) => {
            setAgeFilter(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Age" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ages</SelectItem>
            <SelectItem value="18-25">18 - 25</SelectItem>
            <SelectItem value="26-35">26 - 35</SelectItem>
            <SelectItem value="36-45">36 - 45</SelectItem>
            <SelectItem value="46+">46+</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <p className="text-destructive font-semibold mb-2">Error Loading Data</p>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              size="sm"
            >
              Retry
            </Button>
          </div>
        )}

        {!loading && !error && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-accent select-none"
                  onClick={() => handleSort("id")}
                >
                  <div className="flex items-center">
                    ID
                    {getSortIcon("id")}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-accent select-none"
                  onClick={() => handleSort("username")}
                >
                  <div className="flex items-center">
                    Username
                    {getSortIcon("username")}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-accent select-none"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Name
                    {getSortIcon("name")}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-accent select-none"
                  onClick={() => handleSort("email")}
                >
                  <div className="flex items-center">
                    Email
                    {getSortIcon("email")}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-accent select-none"
                  onClick={() => handleSort("age")}
                >
                  <div className="flex items-center">
                    Age
                    {getSortIcon("age")}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.age}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center text-muted-foreground">
                      <Search className="w-8 h-8 mb-2 opacity-30" />
                      <p>No results found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && users.length > 0 && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} results
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </Button>
            <span className="flex items-center px-3 text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}