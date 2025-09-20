import {render, screen, act, waitFor} from '../../utils/test-utils'
import UserReservations from '@/app/(dashboard)/customer-dashboard/UserReservations';
import CustomerDashboardClient from '@/app/(dashboard)/customer-dashboard/CustomerDashboardClient';

// Mock Supabase client for client-side
const createMockClient = (reservations: any[]) => ({
    auth: {
        getUser: jest.fn().mockResolvedValue({
            data: { user: { id: '123', email: 'test@example.com' } },
        }),
    },
    from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
            data: reservations,
            error: null,
        }),
    }),
});

// Make createClient a Jest mock
const mockCreateClient = jest.fn();
jest.mock('@/utils/supabase/client', () => ({
    createClient: () => mockCreateClient(),
}));

// Test user with reservations
describe('UserReservations Component', () => {
    it('renders reservations when user has some', async () => {
        mockCreateClient.mockReturnValueOnce(
            createMockClient([
                {
                    reservation_id: 1,
                    reservation_date: new Date().toISOString(),
                    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                    return_date: null,
                    status: 'active',
                    books: { title: 'Test Book', author: 'Author A' },
                },
            ])
        );

        render(<UserReservations />);

        await waitFor(() => {
            expect(screen.getByText(/Test Book/i)).toBeInTheDocument();
            expect(screen.getByText(/Author A/i)).toBeInTheDocument();
            expect(screen.getByText(/active/i)).toBeInTheDocument();
        });
    });

    it("renders reservations without crashing", async () => {
        mockCreateClient.mockReturnValueOnce(
            createMockClient([
                {
                    reservation_id: 1,
                    reservation_date: new Date().toISOString(),
                    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                    return_date: null,
                    status: 'active',
                    books: { title: 'Test Book', author: 'Author A' },
                },
            ])
        );

        await act(async () => {
            render(<UserReservations/>);
        });

        await waitFor(() => {
            expect(screen.getByText(/Test Book/i)).toBeInTheDocument();
            expect(screen.getByText(/Author A/i)).toBeInTheDocument();
            expect(screen.getByText(/active/i)).toBeInTheDocument();
        })
    });

    it("renders CustomerDashboardClient with mock profile", async () => {
        mockCreateClient.mockReturnValueOnce(
            createMockClient([
                {
                    reservation_id: 1,
                    reservation_date: new Date().toISOString(),
                    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                    return_date: null,
                    status: 'active',
                    books: { title: 'Test Book', author: 'Author A' },
                },
            ])
        );

        await act(async () => {
            render(
                <CustomerDashboardClient userProfile={{
                    created_at: new Date().toISOString(),
                    email: 'test@example.com',
                    first_name: 'Test',
                    last_name: 'User',
                    is_active: true,
                    penalty_count: 0,
                    role: 'customer',
                    user_id: '123',
                }} userEmail="test@example.com"/>
            );
        });

        // Heading check
        const heading = screen.getByRole('heading', {name: /Welcome, Test/i});
        expect(heading).toBeInTheDocument();

        const matches = screen.getAllByText(/Test/i);
        expect(matches.length).toBeGreaterThan(0);

        // Email check
        expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
    });

    it ('shows "You don’t have any borrowed books." when the user has none', async () => {
        mockCreateClient.mockReturnValueOnce(createMockClient([]));
        await act(async () => {
            render(<UserReservations />);
        })

        await waitFor(() => {
            const emptyMessage = screen.getByText((content, element) => {
                return element?.tagName.toLowerCase() === 'p' &&
                    content.includes("You don’t have any borrowed books");
            });
            expect(emptyMessage).toBeInTheDocument();
        });
    });

    it('renders reservation due date', async () => {
        const dueDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();

        mockCreateClient.mockReturnValueOnce(
            createMockClient([
                {
                    reservation_id: 1,
                    reservation_date: new Date().toISOString(),
                    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), //
                    return_date: null,
                    status: 'active',
                    books: { title: 'Test Book', author: 'Author A' },
                },
            ])
        );

        render(<UserReservations />);

        const formatted = dueDate.split('T')[0]; // "2025-09-25"
        await waitFor(() => {
            expect(screen.getByText(new RegExp(formatted.replace(/-/g, '[-/]'), 'i'))).toBeInTheDocument();
        });
    });
});
