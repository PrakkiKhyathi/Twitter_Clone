package com.twitter.MediaMS.service;

import com.twitter.MediaMS.dto.MediaDTO;
import com.twitter.MediaMS.entity.Media;
import com.twitter.MediaMS.repository.MediaRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service("MediaService")
@Transactional
public class MediaServiceImpl implements MediaService{
    private ModelMapper modelMapper=new ModelMapper();
    @Autowired
    private MediaRepository mediaRepository;
    @Override
    public MediaDTO createMedia(MediaDTO mediaDTO)
    {
        Media media=modelMapper.map(mediaDTO,Media.class);
        media=mediaRepository.save(media);
        return modelMapper.map(media,MediaDTO.class);
    }
    @Override
    public MediaDTO getMediaById(Long mediaId)
    {
        Optional<Media> optional=mediaRepository.findById(mediaId);
        return optional.map(value->modelMapper.map(value,MediaDTO.class)).orElse(null);
    }
    @Override
    public List<MediaDTO> getMediaByTweetId(Long tweetId)
    {
        List<Media> mediaList=mediaRepository.findByTweetId(tweetId);
        return mediaList.stream().map(media->modelMapper.map(media,MediaDTO.class))
                .collect(Collectors.toList());
    }
    @Override
    public void deleteMedia(Long mediaId)
    {
        mediaRepository.deleteById(mediaId);
    }
    @Override
    public void deleteByTweetId(Long tweetId)
    {
        mediaRepository.deleteByTweetId(tweetId);
    }
}
