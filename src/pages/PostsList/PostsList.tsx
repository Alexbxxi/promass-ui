import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Fab,
  Typography,
  styled,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { Navbar } from '@/components';
import { PostDetails } from '@/models/index';
import { setOfflineMode } from '@/redux/slices/offlineSlice';
import { setPosts, selectPosts } from '@/redux/slices/postsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface MaterialCardProps {
  data: PostDetails;
  onViewMore: (id: number) => void;
}

const CreationButtonWrapper = styled('div')(() => ({
  position: 'fixed',
  top: '0',
  right: '0',
  paddingTop: '5rem',
  paddingRight: '1rem',
}));

const MaterialCard: React.FC<MaterialCardProps> = ({ data, onViewMore }) => {
  const offlineMode = useSelector(
    (state: RootState) => state.offline.offlineMode
  );

  return (
    <Card sx={{ maxWidth: 1200, marginBottom: '1rem' }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {data.title}
        </Typography>
        <Typography gutterBottom variant="body2" color="text.secondary">
          {data.author}
        </Typography>
        <Typography gutterBottom variant="body2" color="text.secondary">
          {data.creationDate}
        </Typography>
        <Typography
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '70ch',
          }}
          variant="body2"
          color="text.secondary"
        >
          {data.content}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => onViewMore(data.id)}
          disabled={offlineMode}
        >
          Leer más
        </Button>
      </CardActions>
    </Card>
  );
};

const MaterialCardList: React.FC<{
  data: PostDetails[];
  onViewMore: (id: number) => void;
}> = ({ data, onViewMore }) => (
  <div>
    {data.map((item) => (
      <MaterialCard key={item.id} data={item} onViewMore={onViewMore} />
    ))}
  </div>
);

const BlogPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const offlineMode = useSelector(
    (state: RootState) => state.offline.offlineMode
  );
  const allPosts = useSelector(selectPosts);
  const [filteredPosts, setFilteredPosts] = useState<PostDetails[]>(allPosts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get<PostDetails[]>(
          'http://localhost:3000/api/v1/posts'
        );
        dispatch(setPosts(response.data));
        dispatch(setOfflineMode(false));
        localStorage.setItem('posts', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error al obtener posts:', error);

        try {
          const storedPosts = localStorage.getItem('posts');
          if (storedPosts) {
            dispatch(setPosts(JSON.parse(storedPosts)));
            dispatch(setOfflineMode(true));
            setLoading(false);
            return;
          }
        } catch (parseError) {
          console.error(
            'Error al analizar los datos en localStorage:',
            parseError
          );
        }

        setError('Error al obtener posts. Por favor, inténtalo de nuevo.');
        dispatch(setOfflineMode(true));
      } finally {
        setLoading(false);
      }
    };

    if (!offlineMode && allPosts.length === 0) {
      fetchPosts();
    } else {
      setLoading(false);
    }
  }, [dispatch, offlineMode, allPosts]);

  useEffect(() => {
    const filtered = allPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [allPosts, searchTerm]);

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  };

  const handleViewMore = (id: number) => {
    const post = allPosts.find((p) => p.id === id);
    if (post) {
      navigate(`/post/${post.id}`);
    }
  };

  return (
    <div>
      <CreationButtonWrapper>
        <Fab
          color="secondary"
          variant="extended"
          aria-label="add"
          onClick={() => navigate('/post')}
          disabled={offlineMode}
        >
          <AddIcon />
          Crear entrada
        </Fab>
      </CreationButtonWrapper>
      <Navbar onSearchChange={handleSearchChange} />
      {offlineMode && (
        <Typography
          variant="body2"
          sx={{
            backgroundColor: '#f44336',
            color: '#fff',
            padding: '1rem',
            margin: '1rem 0',
            borderRadius: '4px',
            textAlign: 'center',
          }}
        >
          Estás en modo offline. Algunas funciones podrían estar limitadas.
        </Typography>
      )}
      {loading && <Typography variant="body2">Cargando posts...</Typography>}
      {error && (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      )}
      {!loading && !error && (
        <MaterialCardList data={filteredPosts} onViewMore={handleViewMore} />
      )}
    </div>
  );
};

export default BlogPage;
