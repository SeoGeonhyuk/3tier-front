import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DatabaseDemo from './DatabaseDemo';

// Mock the config
jest.mock('../../config', () => ({
    SERVER_URL: 'http://test-server.com'
}));

// Mock fetch
global.fetch = jest.fn();

describe('DatabaseDemo Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset fetch mock
        global.fetch.mockClear();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Component Rendering', () => {
        test('should render the component with title', async () => {
            global.fetch.mockResolvedValueOnce({
                json: async () => ({ result: [] })
            });

            render(<DatabaseDemo />);

            // Wait for initial componentDidMount to complete
            await waitFor(() => {
                expect(screen.getByText('Aurora Database Demo Page')).toBeInTheDocument();
            });
        });

        test('should render table headers', async () => {
            global.fetch.mockResolvedValueOnce({
                json: async () => ({ result: [] })
            });

            render(<DatabaseDemo />);

            await waitFor(() => {
                expect(screen.getByText('ID')).toBeInTheDocument();
                expect(screen.getByText('AMOUNT')).toBeInTheDocument();
                expect(screen.getByText('DESC')).toBeInTheDocument();
            });
        });

        test('should render ADD and DEL buttons', async () => {
            global.fetch.mockResolvedValueOnce({
                json: async () => ({ result: [] })
            });

            render(<DatabaseDemo />);

            await waitFor(() => {
                expect(screen.getByRole('button', { name: 'ADD' })).toBeInTheDocument();
                expect(screen.getByRole('button', { name: 'DEL' })).toBeInTheDocument();
            });
        });

        test('should render input fields for amount and description', async () => {
            global.fetch.mockResolvedValueOnce({
                json: async () => ({ result: [] })
            });

            render(<DatabaseDemo />);

            await waitFor(() => {
                const inputs = screen.getAllByRole('textbox');
                expect(inputs).toHaveLength(2);
            });
        });
    });

    describe('Data Fetching', () => {
        test('should fetch transactions on component mount', async () => {
            const mockTransactions = [
                { id: 1, amount: 100, description: 'Transaction 1', created_at: '2024-01-01' },
                { id: 2, amount: 200, description: 'Transaction 2', created_at: '2024-01-02' }
            ];

            global.fetch.mockResolvedValueOnce({
                json: async () => ({ result: mockTransactions })
            });

            render(<DatabaseDemo />);

            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith('http://test-server.com/transaction');
            });
        });

        test('should display fetched transactions', async () => {
            const mockTransactions = [
                { id: 1, amount: 100, description: 'Transaction 1', created_at: '2024-01-01' },
                { id: 2, amount: 200, description: 'Transaction 2', created_at: '2024-01-02' }
            ];

            global.fetch.mockResolvedValueOnce({
                json: async () => ({ result: mockTransactions })
            });

            render(<DatabaseDemo />);

            await waitFor(() => {
                expect(screen.getByText('Transaction 1')).toBeInTheDocument();
                expect(screen.getByText('Transaction 2')).toBeInTheDocument();
                expect(screen.getByText('100')).toBeInTheDocument();
                expect(screen.getByText('200')).toBeInTheDocument();
            });
        });

        test('should retry fetch on failure', async () => {
            // First two calls fail, third succeeds
            global.fetch
                .mockRejectedValueOnce(new Error('Network error'))
                .mockRejectedValueOnce(new Error('Network error'))
                .mockResolvedValueOnce({
                    json: async () => ({ result: [] })
                });

            render(<DatabaseDemo />);

            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledTimes(3);
            }, { timeout: 5000 });
        });

        test('should handle empty transaction list', async () => {
            global.fetch.mockResolvedValueOnce({
                json: async () => ({ result: [] })
            });

            render(<DatabaseDemo />);

            await waitFor(() => {
                // Only headers and input row should be visible
                expect(screen.queryByText('Transaction 1')).not.toBeInTheDocument();
            });
        });
    });

    describe('Adding Transactions', () => {
        test('should add transaction when ADD button is clicked', async () => {
            // Initial fetch
            global.fetch.mockResolvedValueOnce({
                json: async () => ({ result: [] })
            });

            render(<DatabaseDemo />);

            await waitFor(() => {
                expect(screen.getByRole('button', { name: 'ADD' })).toBeInTheDocument();
            });

            const inputs = screen.getAllByRole('textbox');
            const amountInput = inputs[0];
            const descInput = inputs[1];
            const addButton = screen.getByRole('button', { name: 'ADD' });

            // Fill in form
            fireEvent.change(amountInput, { target: { value: '150' } });
            fireEvent.change(descInput, { target: { value: 'New Transaction' } });

            // Mock POST and subsequent GET
            global.fetch
                .mockResolvedValueOnce({
                    json: async () => ({ message: 'added transaction successfully' })
                })
                .mockResolvedValueOnce({
                    json: async () => ({
                        result: [{ id: 1, amount: 150, description: 'New Transaction', created_at: '2024-01-01' }]
                    })
                });

            // Click ADD and wait for all state updates to complete
            fireEvent.click(addButton);

            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith(
                    'http://test-server.com/transaction',
                    expect.objectContaining({
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ amount: '150', desc: 'New Transaction' })
                    })
                );
            });

            // Wait for populateData to complete
            await waitFor(() => {
                expect(screen.getByText('New Transaction')).toBeInTheDocument();
            });
        });

        test('should clear input fields after adding transaction', async () => {
            // Initial fetch
            global.fetch.mockResolvedValueOnce({
                json: async () => ({ result: [] })
            });

            render(<DatabaseDemo />);

            await waitFor(() => {
                expect(screen.getByRole('button', { name: 'ADD' })).toBeInTheDocument();
            });

            const inputs = screen.getAllByRole('textbox');
            const amountInput = inputs[0];
            const descInput = inputs[1];
            const addButton = screen.getByRole('button', { name: 'ADD' });

            fireEvent.change(amountInput, { target: { value: '150' } });
            fireEvent.change(descInput, { target: { value: 'New Transaction' } });

            global.fetch
                .mockResolvedValueOnce({
                    json: async () => ({ message: 'added transaction successfully' })
                })
                .mockResolvedValueOnce({
                    json: async () => ({ result: [] })
                });

            fireEvent.click(addButton);

            // Wait for both setState (input clear) and populateData to complete
            await waitFor(() => {
                expect(amountInput.value).toBe('');
                expect(descInput.value).toBe('');
            });

            // Ensure all fetch operations complete
            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledTimes(3); // Initial + POST + GET after POST
            });
        });
    });

    describe('Deleting All Transactions', () => {
        test('should delete all transactions when DEL button is clicked', async () => {
            const mockTransactions = [
                { id: 1, amount: 100, description: 'Transaction 1', created_at: '2024-01-01' },
                { id: 2, amount: 200, description: 'Transaction 2', created_at: '2024-01-02' }
            ];

            // Initial fetch
            global.fetch.mockResolvedValueOnce({
                json: async () => ({ result: mockTransactions })
            });

            render(<DatabaseDemo />);

            await waitFor(() => {
                expect(screen.getByText('Transaction 1')).toBeInTheDocument();
            });

            const delButton = screen.getByRole('button', { name: 'DEL' });

            // Mock DELETE and subsequent GET
            global.fetch
                .mockResolvedValueOnce({
                    json: async () => ({ message: 'delete function execution finished.' })
                })
                .mockResolvedValueOnce({
                    json: async () => ({ result: [] })
                });

            fireEvent.click(delButton);

            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith(
                    'http://test-server.com/transaction',
                    expect.objectContaining({
                        method: 'DELETE'
                    })
                );
            });

            // Wait for populateData to complete
            await waitFor(() => {
                expect(screen.queryByText('Transaction 1')).not.toBeInTheDocument();
            });
        });

        test('should clear input fields after deleting all transactions', async () => {
            global.fetch.mockResolvedValueOnce({
                json: async () => ({ result: [] })
            });

            render(<DatabaseDemo />);

            await waitFor(() => {
                expect(screen.getByRole('button', { name: 'DEL' })).toBeInTheDocument();
            });

            const inputs = screen.getAllByRole('textbox');
            const amountInput = inputs[0];
            const descInput = inputs[1];

            fireEvent.change(amountInput, { target: { value: '150' } });
            fireEvent.change(descInput, { target: { value: 'Test' } });

            const delButton = screen.getByRole('button', { name: 'DEL' });

            global.fetch
                .mockResolvedValueOnce({
                    json: async () => ({ message: 'delete function execution finished.' })
                })
                .mockResolvedValueOnce({
                    json: async () => ({ result: [] })
                });

            fireEvent.click(delButton);

            // Wait for setState to clear inputs
            await waitFor(() => {
                expect(amountInput.value).toBe('');
                expect(descInput.value).toBe('');
            });

            // Ensure populateData completes
            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledTimes(3); // Initial + DELETE + GET after DELETE
            });
        });
    });

    describe('Input Handling', () => {
        test('should update state when amount input changes', async () => {
            global.fetch.mockResolvedValueOnce({
                json: async () => ({ result: [] })
            });

            render(<DatabaseDemo />);

            await waitFor(() => {
                expect(screen.getByRole('button', { name: 'ADD' })).toBeInTheDocument();
            });

            const inputs = screen.getAllByRole('textbox');
            const amountInput = inputs[0];

            fireEvent.change(amountInput, { target: { value: '500' } });

            expect(amountInput.value).toBe('500');
        });

        test('should update state when description input changes', async () => {
            global.fetch.mockResolvedValueOnce({
                json: async () => ({ result: [] })
            });

            render(<DatabaseDemo />);

            await waitFor(() => {
                expect(screen.getByRole('button', { name: 'ADD' })).toBeInTheDocument();
            });

            const inputs = screen.getAllByRole('textbox');
            const descInput = inputs[1];

            fireEvent.change(descInput, { target: { value: 'Test Description' } });

            expect(descInput.value).toBe('Test Description');
        });
    });

    describe('Error Handling', () => {
        test('should handle fetch errors gracefully', async () => {
            // Mock console.log to avoid cluttering test output
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            global.fetch.mockRejectedValue(new Error('Network error'));

            render(<DatabaseDemo />);

            // Component should still render even if fetch fails
            await waitFor(() => {
                expect(screen.getByText('Aurora Database Demo Page')).toBeInTheDocument();
            });

            consoleSpy.mockRestore();
        });
    });
});
