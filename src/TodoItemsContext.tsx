import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useReducer,
} from 'react';

import produce from 'immer';

export interface TodoItem {
    id: string;
    title: string;
    details?: string;
    done: boolean;
}

interface TodoItemsState {
    todoItems: TodoItem[];
}

interface TodoItemsAction {
    type: 'loadState' | 'add' | 'delete' | 'toggleDone';
    data: any;
}

const TodoItemsContext = createContext<
    (TodoItemsState & { dispatch: (action: TodoItemsAction) => void }) | null
>(null);

const defaultState : object = { todoItems: [] };

const localStorageKey = 'todoListState';

export const TodoItemsContextProvider = ({
    children,
}: {
    children?: ReactNode;
}) => {
    const [state, dispatch] = useReducer(todoItemsReducer, defaultState);

    window.addEventListener('storage', event => {
        const eventlistener = JSON.parse(event.storageArea?.todoListState)
        dispatch({ type: 'loadState', data: eventlistener });
    })
    
    useEffect(() => {
        const savedState = localStorage.getItem(localStorageKey);  
        
        if (savedState) {
            try {
                const savedStateObj = JSON.parse(savedState);
                
                dispatch({ type: 'loadState', data: savedStateObj });
            } catch {}
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(localStorageKey, JSON.stringify(state));
    }, [state]);

    return (
        <TodoItemsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </TodoItemsContext.Provider>
    );
};

export const useTodoItems = () => {
    const todoItemsContext = useContext(TodoItemsContext);

    if (!todoItemsContext) {
        throw new Error(
            'useTodoItems hook should only be used inside TodoItemsContextProvider',
        );
    }

    return todoItemsContext;
};

function todoItemsReducer(state: TodoItemsState, action: TodoItemsAction) {
    switch (action.type) {
        case 'loadState': {
            return action.data;
        }
        case 'add':
            // с immer
            return produce(state, draft =>{
                draft.todoItems = [
                            { id: generateId(), done: false, ...action.data.todoItem },
                            ...draft.todoItems,
                        ]
            })

            // до immer
            // {
            //     ...state,
            //     todoItems: [
            //         { id: generateId(), done: false, ...action.data.todoItem },
            //         ...state.todoItems,
            //     ],
            // };
        case 'delete':
            return produce(state, draft =>{
                draft.todoItems = draft.todoItems.filter(
                    ({ id }) => id !== action.data.id,
                )
            })
            // {
            //     ...state,
            //     todoItems: state.todoItems.filter(
            //         ({ id }) => id !== action.data.id,
            //     ),
            // };
        case 'toggleDone':
            const itemIndex = state.todoItems.findIndex(
                ({ id }) => id === action.data.id,
            );
            const item = state.todoItems[itemIndex];

            return produce(state, draft =>{
                draft.todoItems = [
                            ...draft.todoItems.slice(0, itemIndex),
                            { ...item, done: !item.done },
                            ...draft.todoItems.slice(itemIndex + 1),
                        ]
            })
            
            // {
            //     ...state,
            //     todoItems: [
            //         ...state.todoItems.slice(0, itemIndex),
            //         { ...item, done: !item.done },
            //         ...state.todoItems.slice(itemIndex + 1),
            //     ],
            // };
        default:
            throw new Error();
    }
}

function generateId() {
    return `${Date.now().toString(36)}-${Math.floor(
        Math.random() * 1e16,
    ).toString(36)}`;
}
