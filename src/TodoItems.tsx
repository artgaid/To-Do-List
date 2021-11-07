import { useCallback, useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { motion } from 'framer-motion';
import { TodoItem, useTodoItems } from './TodoItemsContext';

import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
    ResponderProvided,
    DraggableProvided,
    DroppableProvided,
  } from "react-beautiful-dnd";

const spring = {
    type: 'spring',
    damping: 25,
    stiffness: 120,
    duration: 0.25,
};

const useTodoItemListStyles = makeStyles({
    root: {
        listStyle: 'none',
        padding: 0,
    },
});

export const TodoItemsList = function () {
    const { todoItems } = useTodoItems();

    const classes = useTodoItemListStyles();

    
    const sortedItems = todoItems.slice().sort((a, b) => {
        if (a.done && !b.done) {
            return 1;
        }
        
        if (!a.done && b.done) {
            return -1;
        }
        
        return 0;
    });
    
    const [localItems, setLocalItems] = useState<Array<any>>(sortedItems);

    const handleDragEnd = (result: DropResult, provided?: ResponderProvided) => {
        if (!result.destination) {
        return;
        }

        if (result.destination.index === result.source.index) {
        return;
        }

        setLocalItems((prev: any) => {
            const temp = [...prev];
            const d = temp[result.destination!.index];
            temp[result.destination!.index] = temp[result.source.index];
            temp[result.source.index] = d;
            
            console.log(temp, 'temp');
            
            return temp;
        });

    };

    useEffect(()=>{
        setLocalItems(sortedItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[todoItems])

    return (
         <DragDropContext onDragEnd={handleDragEnd}>
             <Droppable droppableId="droppable" direction="vertical">
                {(droppableProvided: DroppableProvided) => (
                    <ul 
                    className={classes.root}
                    ref={droppableProvided.innerRef}
                    {...droppableProvided.droppableProps}
                    >
                        {localItems.map((item, index) => (
                            <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                            >
                            {(
                                draggableProvided: DraggableProvided,
                            ) => {
                                return (
                                    <motion.li key={item.id} 
                                    transition={spring} 
                                    ref={draggableProvided.innerRef}
                                    {...draggableProvided.draggableProps}
                                    >
                                        <div {...draggableProvided.dragHandleProps}>
                                            <TodoItemCard item={item} />
                                        </div>
                                    </motion.li>
                                );
                            }}
                            </Draggable>
                        ))}
                        {droppableProvided.placeholder}
                    </ul>
                )}
            </Droppable>
        </DragDropContext>
    );
};

const useTodoItemCardStyles = makeStyles({
    root: {
        marginTop: 24,
        marginBottom: 24,
    },
    doneRoot: {
        textDecoration: 'line-through',
        color: '#888888',
    },
});

export const TodoItemCard = function ({ item }: { item: TodoItem }) {
    const classes = useTodoItemCardStyles();
    const { dispatch } = useTodoItems();

    const handleDelete = useCallback(
        () => dispatch({ type: 'delete', data: { id: item.id } }),
        [item.id, dispatch],
    );

    const handleToggleDone = useCallback(
        () =>
            dispatch({
                type: 'toggleDone',
                data: { id: item.id },
            }),
        [item.id, dispatch],
    );

    return (
        <Card
            className={classnames(classes.root, {
                [classes.doneRoot]: item.done,
            })}
        >
            <CardHeader
                action={
                    <IconButton aria-label="delete" onClick={handleDelete}>
                        <DeleteIcon />
                    </IconButton>
                }
                title={
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={item.done}
                                onChange={handleToggleDone}
                                name={`checked-${item.id}`}
                                color="primary"
                            />
                        }
                        label={item.title}
                    />
                }
            />
            {item.details ? (
                <CardContent>
                    <Typography variant="body2" component="p">
                        {item.details}
                    </Typography>
                </CardContent>
            ) : null}
        </Card>
    );
};


