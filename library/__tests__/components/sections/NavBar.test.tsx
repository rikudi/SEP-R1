import {render, screen, waitFor} from '../../utils/test-utils'
import NavBar from "@/components/sections/NavBar";
import {act} from "react";

jest.mock('@supabase/ssr');

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(() => ({})),
}));

// Mock the server-side APIs to avoid errors
jest.mock('next/headers', () => ({
    cookies: jest.fn(() => ({
        get: jest.fn(() => undefined),
    })),
    headers: jest.fn(() => ({
        get: jest.fn(() => undefined),
    })),
}));

describe('NavBar Component', () => {
    it('renders navbar section with correct content', async () => {
        await act(async () => {
            render(<NavBar/>);
        });

        // Test text in NavBar
        await waitFor(() => {
            expect(screen.getByText('LibraryHub')).toBeInTheDocument()
        });
    });

    it('displays search functionality', async () => {
        await act(async () => {
            render(<NavBar/>);
        });

        // Test search input
        await waitFor(() => {
            const searchInput = screen.getByPlaceholderText(/Search title, authors, or categories/)
            expect(searchInput).toBeInTheDocument()
            expect(searchInput).toHaveAttribute('type', 'text')
        });
    });

    it('has accessible structure', async () => {
        await act(async () => {
            render(<NavBar/>)
        });

        // Test semantic structure
        await waitFor(() => {
            expect(screen.getByRole('textbox')).toBeInTheDocument(); // Search input
            const signInButton = screen.getByRole('button', { name: /Sign In/i });
            expect(signInButton).toBeInTheDocument();
        });
    });
});
